// Passar a composition de string para JSON
function parseNestedJSON (jsonString) {
  let parsedJSON = JSON.parse(jsonString);

  const recursiveParse = (jsonObject) => {
    for (let key in jsonObject) {
      if (typeof jsonObject[key] === 'string') {
        try {
          jsonObject[key] = JSON.parse(jsonObject[key]);
        } catch (error) {
          // Se não dá para fazer o Parse, então deixa o valor como está
        }
      } else if (typeof jsonObject[key] === 'object') {
        recursiveParse(jsonObject[key]);
      }
    }
  };

  recursiveParse(parsedJSON);
  return(parsedJSON);
}


// Uniformizar a composition (remover os blocks)
function removeBlocks(composition) {
  try {
    composition["items.0.0.items.0.items.0.value"] = composition["items.0.0.items.0.items.0.value"].blocks[0].text;
  } catch {};
  try {
    composition["items.0.0.items.0.items.1.items.0.value"] = composition["items.0.0.items.0.items.1.items.0.value"].blocks[0].text;
  } catch {};
  try {
    composition["items.0.1.items.3.value"] = composition["items.0.1.items.3.value"].blocks[0].text;
  } catch {};
  try {
    composition["items.0.1.items.5.items.0.value"] = composition["items.0.1.items.5.items.0.value"].blocks[0].text;
  } catch {};
  try {
    composition["items.0.1.items.5.items.1.value"] = composition["items.0.1.items.5.items.1.value"].blocks[0].text;
  } catch {};
  resultados = JSON.parse(JSON.stringify(composition["items.0.1.items.2.value"]))
  composition["items.0.1.items.2.value"] = [];
  resultados.forEach(resultado => {
    let resultado_corrigido = JSON.parse(JSON.stringify(resultado))
    try {
      resultado_corrigido["values"]["items.0.1.items.2.items.1.value"] = resultado.values["items.0.1.items.2.items.1.value"].blocks[0].text;
    } catch {};
    try {
      resultado_corrigido["values"]["items.0.1.items.2.items.2.items.0.value"] = resultado.values["items.0.1.items.2.items.2.items.0.value"].blocks[0].text;
    } catch {};
    try {
      resultado_corrigido["values"]["items.0.1.items.2.items.2.items.1.value"] = resultado.values["items.0.1.items.2.items.2.items.1.value"].blocks[0].text;
    } catch {};
    composition["items.0.1.items.2.value"].push(resultado_corrigido)
  });
  return composition;
}


// Incrementar a versão do ID dos forms
var FormModel = require('../model/Form');
var { v4: uuidv4 } = require('uuid');
async function incrementVersionNumber(version_id) {
  if (version_id) {
    var regex = /(.+?)-v(\d+)$/;
    var match = regex.exec(version_id);
    if (match) {
      var base_id = match[1];
      return new Promise((resolve, reject) => {
        FormModel.find({ id: { $regex: base_id } })
          .then(forms => {
            let newVersion = forms.length + 1;
            resolve(base_id + "-v" + newVersion);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  } else {
    return uuidv4() + "-v1";
  }
}


// Passar a composition, no formato JSON, para FHIR
function compositionToFHIR(composition_id, composition, user) {
  const fhir_message = require('./fhir_analises.json');
  var fhir = JSON.parse(JSON.stringify(fhir_message));

  // Alterar informação na mensagem FHIR:

  // Dados
  // Paciente - ID, Nome, Género, Data Nascimento, Morada
  fhir.entry[1].resource.name[0].text = composition["items.0.0.items.0.items.0.value"];
  fhir.entry[1].resource.gender = composition["items.0.0.items.0.items.3.value"].text;
  fhir.entry[1].resource.birthDate = composition["items.0.0.items.0.items.2.items.0.value.date"];
  fhir.entry[1].resource.address[0].text = composition["items.0.0.items.0.items.1.items.0.value"];

  // Diagnostic Report - Categoria, Código, Conclusão
  // Categoria
  fhir.entry[2].resource.category.coding[1].code = composition["items.0.1.items.0.value"].code.replace(/local_terms::/g, "");
  fhir.entry[2].resource.category.coding[1].display = composition["items.0.1.items.0.value"].text;
  // Código
  fhir.entry[2].resource.code.coding = [];
  let code_list = composition["items.0.1.items.1.value"];
  for (let i=0; i<code_list.length; i++) {
    fhir.entry[2].resource.code.coding.push({
    code: code_list[i].code.replace(/local_terms::/g, ""),
    display: code_list[i].text
  })
  };
  // Conclusão
  fhir.entry[2].resource.conclusion = composition["items.0.1.items.3.value"];

  // Observation - Método/Código, Valor, Técnico (ID e Nome), Data Aquisição
  const base_observation = fhir.entry[4];
  fhir.entry.splice(3, 9);
  const observation_list = composition["items.0.1.items.2.value"];
  for (let i=0; i<observation_list.length; i++) {
  let observation = JSON.parse(JSON.stringify(base_observation));
  // Método/Código
  observation.resource.code.coding[0].code = observation_list[i].values["items.0.1.items.2.items.0.value"].code.replace(/local_terms::/g, "");
  observation.resource.code.coding[0].display = observation_list[i].values["items.0.1.items.2.items.0.value"].text;
  // Valor
  observation.resource.valueQuantity.value = observation_list[i].values["items.0.1.items.2.items.1.value"];
  // Técnico (ID e Nome)
  observation.resource.performer[0].reference = "Practitioner/"+observation_list[i].values["items.0.1.items.2.items.2.items.1.value"];
  observation.resource.performer[0].display = observation_list[i].values["items.0.1.items.2.items.2.items.0.value"];
  // Data Aquisição
  const date = observation_list[i].values["items.0.1.items.2.items.3.value.date"];
  const time = observation_list[i].values["items.0.1.items.2.items.3.value.time"];
  const combinedDateTime = `${date}T${time}:00`;
  const dateTime = new Date(combinedDateTime);
  observation.resource.effectiveDateTime = dateTime;

  fhir.entry.splice(3+i, 0, observation);
  }

  // Practitioner - User com sessão iniciada
  fhir.entry[3+observation_list.length].resource.id = user.id;
  fhir.entry[3+observation_list.length].resource.identifier[0].value = user.id;
  fhir.entry[3+observation_list.length].resource.name[0].text = user.name;

  // Organization
  fhir.entry.splice(fhir.entry.length-1)

      // Metadados
  // Data da última atualização, ID
  const current_date = new Date();
  fhir.meta.lastUpdated = current_date;
  fhir.id = composition_id;

  return fhir;
};

// // Passar a compositiong, no formato JSON, para FHIR
// function compositionToFHIR(composition_id, composition, user) {
//   var fhir_message = require('./fhir_analises.json');

//   // Alterar informação na mensagem FHIR:

//   // Dados
//   // Paciente - ID, Nome, Género, Data Nascimento, Morada
//   fhir_message.entry[1].resource.name[0].text = composition["items.0.0.items.0.items.0.value"].blocks[0].text;
//   fhir_message.entry[1].resource.gender = composition["items.0.0.items.0.items.3.value"].text;
//   fhir_message.entry[1].resource.birthDate = composition["items.0.0.items.0.items.2.items.0.value.date"];
//   fhir_message.entry[1].resource.address[0].text = composition["items.0.0.items.0.items.1.items.0.value"].blocks[0].text;

//   // Diagnostic Report - Categoria, Código, Conclusão
//   // Categoria
//   fhir_message.entry[2].resource.category.coding[1].code = composition["items.0.1.items.0.value"].code.replace(/local_terms::/g, "");
//   fhir_message.entry[2].resource.category.coding[1].display = composition["items.0.1.items.0.value"].text;
//   // Código
//   fhir_message.entry[2].resource.code.coding = [];
//   let code_list = composition["items.0.1.items.1.value"];
//   for (let i=0; i<code_list.length; i++) {
//     fhir_message.entry[2].resource.code.coding.push({
//     code: code_list[i].code.replace(/local_terms::/g, ""),
//     display: code_list[i].text
//   })
//   };
//   // Conclusão
//   fhir_message.entry[2].resource.conclusion = composition["items.0.1.items.3.value"].blocks[0].text;

//   // Observation - Método/Código, Valor, Técnico (ID e Nome), Data Aquisição
//   const base_observation = fhir_message.entry[4];
//   fhir_message.entry.splice(3, 9);
//   const observation_list = composition["items.0.1.items.2.value"];
//   for (let i=0; i<observation_list.length; i++) {
//   let observation = JSON.parse(JSON.stringify(base_observation));
//   // Método/Código
//   observation.resource.code.coding[0].code = observation_list[i].values["items.0.1.items.2.items.0.value"].code.replace(/local_terms::/g, "");
//   observation.resource.code.coding[0].display = observation_list[i].values["items.0.1.items.2.items.0.value"].text;
//   // Valor
//   observation.resource.valueQuantity.value = observation_list[i].values["items.0.1.items.2.items.1.value"].blocks[0].text;
//   // Técnico (ID e Nome)
//   observation.resource.performer[0].reference = "Practitioner/"+observation_list[i].values["items.0.1.items.2.items.2.items.1.value"].blocks[0].text;
//   observation.resource.performer[0].display = observation_list[i].values["items.0.1.items.2.items.2.items.0.value"].blocks[0].text;
//   // Data Aquisição
//   const date = observation_list[i].values["items.0.1.items.2.items.3.value.date"];
//   const time = observation_list[i].values["items.0.1.items.2.items.3.value.time"];
//   const combinedDateTime = `${date}T${time}:00`;
//   const dateTime = new Date(combinedDateTime);
//   observation.resource.effectiveDateTime = dateTime;

//   fhir_message.entry.splice(3+i, 0, observation);
//   }

//   // Practitioner - User com sessão iniciada
//   fhir_message.entry[3+observation_list.length].resource.id = user.id;
//   fhir_message.entry[3+observation_list.length].resource.identifier[0].value = user.id;
//   fhir_message.entry[3+observation_list.length].resource.name[0].text = user.name;

//   // Organization
//   fhir_message.entry.splice(fhir_message.entry.length-1)

//       // Metadados
//   // Data da última atualização, ID
//   const current_date = new Date();
//   fhir_message.meta.lastUpdated = current_date;
//   fhir_message.id = composition_id;

//   return fhir_message;
// };

module.exports = {parseNestedJSON, incrementVersionNumber, compositionToFHIR, removeBlocks};