var FormModel = require('../model/Form');
var { v4: uuidv4 } = require('uuid');



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
  let composition_elements = ["items.0.0.items.0.items.0.value", "items.0.0.items.0.items.1.value",
  "items.0.0.items.0.items.2.items.0.value", "items.0.1.items.3.value",
  "items.0.1.items.5.items.0.value", "items.0.1.items.5.items.1.value"];
  composition_elements.forEach(element => {
    try {
      let content = '';
      composition[element].blocks.forEach(block => {
        content = content + "\n" + block.text;
      });
      composition[element] = content.substring(1);
    } catch {};
  });
  resultados = JSON.parse(JSON.stringify(composition["items.0.1.items.2.value"]))
  composition["items.0.1.items.2.value"] = [];
  resultados.forEach(resultado => {
    let result_elements = ["items.0.1.items.2.items.1.value", "items.0.1.items.2.items.2.value",
    "items.0.1.items.2.items.3.items.0.value", "items.0.1.items.2.items.3.items.1.value"];
    let resultado_corrigido = JSON.parse(JSON.stringify(resultado))
    result_elements.forEach(element => {
      try {
        let content = '';
        resultado.values[element].blocks.forEach(block => {
          content = content + "\n" + block.text;
        });
        resultado_corrigido["values"][element] = content.substring(1);
      } catch {};
    });
    composition["items.0.1.items.2.value"].push(resultado_corrigido)
  });
  return composition;
}



// Incrementar a versão do ID dos forms
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
function compositionToFHIR(composition_id, composition, user, updatedAt) {
  const fhir_message = require('./fhir_analises.json');
  var fhir = JSON.parse(JSON.stringify(fhir_message));

  // Alterar informação na mensagem FHIR:
  let headerID = uuidv4();
  let diagnosticID = uuidv4();

  // Metadados
  // Data da última atualização, ID
  fhir.meta.lastUpdated = updatedAt;
  fhir.id = composition_id;
  // MessageHeader
  fhir.entry[0].fullUrl = "http://spms.min-saude.pt/fhir/MessageHeader/" + headerID;
  fhir.entry[0].resource.id = headerID;
  fhir.entry[0].resource.timestamp = updatedAt;
  fhir.entry[0].resource.focus[0].reference = "DiagnosticReport/" + diagnosticID;

  // Paciente
  // ID
  fhir.entry[1].resource.id = composition["items.0.0.items.0.items.0.value"];
  // Nome
  fhir.entry[1].resource.name[0].text = composition["items.0.0.items.0.items.1.value"];
  // Género
  try {
    fhir.entry[1].resource.gender = composition["items.0.0.items.0.items.4.value"].text;
  } catch (error) {
    fhir.entry[1].resource.gender = null;
  }
  // Data de Nascimento
  fhir.entry[1].resource.birthDate = composition["items.0.0.items.0.items.3.items.0.value"];
  // Morada
  fhir.entry[1].resource.address[0].text = composition["items.0.0.items.0.items.2.items.0.value"];
  // Metadados
  fhir.entry[1].fullUrl = "http://spms.min-saude.pt/fhir/Patient/" + composition["items.0.0.items.0.items.0.value"];
  delete fhir.entry[1].resource.extension;
  fhir.entry[1].resource.identifier[0].value = composition["items.0.0.items.0.items.0.value"];

  // Diagnostic
  // Categoria
  try {
    fhir.entry[2].resource.category.coding[1].code = composition["items.0.1.items.0.value"].code.replace(/local_terms::/g, "");
  } catch (error) {
    fhir.entry[2].resource.category.coding[1].code = null;
  }
  try {
    fhir.entry[2].resource.category.coding[1].display = composition["items.0.1.items.0.value"].text;
  } catch (error) {
    fhir.entry[2].resource.category.coding[1].display = null;
  }
  // Código
  fhir.entry[2].resource.code.coding = [];
  let code_list = composition["items.0.1.items.1.value"];
  try {
    for (let i=0; i<code_list.length; i++) {
      fhir.entry[2].resource.code.coding.push({
        code: code_list[i].code.replace(/local_terms::/g, ""),
        display: code_list[i].text
      })
    }
  } catch (error) {
    
  };
  // Conclusão
  fhir.entry[2].resource.conclusion = composition["items.0.1.items.3.value"];
  // Metadados
  fhir.entry[2].fullUrl = "http://spms.min-saude.pt/fhir/DiagnosticReport/" + diagnosticID;
  fhir.entry[2].resource.id = diagnosticID;
  fhir.entry[2].resource.basedOn[0].identifier.value = diagnosticID;
  fhir.entry[2].resource.subject.reference = "Patient/" + composition["items.0.0.items.0.items.0.value"];
  fhir.entry[2].resource.issued = updatedAt;
  fhir.entry[2].resource.performer[1].actor.reference = "Practitioner/" + user.id;
  fhir.entry[2].resource.performer[1].actor.display = user.name;
  fhir.entry[2].resource.result = [];

  // Observation
  const base_observation = fhir.entry[4];
  fhir.entry.splice(3, 9);
  const observation_list = composition["items.0.1.items.2.value"];
  for (let i=0; i<observation_list.length; i++) {
    let observation = JSON.parse(JSON.stringify(base_observation));
    // Método/Código
    try {
      observation.resource.code.coding[0].code = observation_list[i].values["items.0.1.items.2.items.0.value"].code.replace(/local_terms::/g, "");
    } catch (error) {
      observation.resource.code.coding[0].code = null;
    }
    try {
      observation.resource.code.coding[0].display = observation_list[i].values["items.0.1.items.2.items.0.value"].text;
    } catch (error) {
      observation.resource.code.coding[0].display = null;
    }
    // Valor
    observation.resource.valueQuantity.value = observation_list[i].values["items.0.1.items.2.items.1.value"];
    observation.resource.valueQuantity.unit = observation_list[i].values["items.0.1.items.2.items.2.value"];
    observation.resource.valueQuantity.code = observation_list[i].values["items.0.1.items.2.items.2.value"];
    // Técnico (ID e Nome)
    observation.resource.performer[0].reference = "Practitioner/"+observation_list[i].values["items.0.1.items.2.items.3.items.1.value"];
    observation.resource.performer[0].display = observation_list[i].values["items.0.1.items.2.items.3.items.0.value"];
    // Data Aquisição
    const date = observation_list[i].values["items.0.1.items.2.items.4.value.date"];
    const time = observation_list[i].values["items.0.1.items.2.items.4.value.time"];
    const combinedDateTime = `${date}T${time}:00`;
    const dateTime = new Date(combinedDateTime);
    observation.resource.effectiveDateTime = dateTime;
    // Metadados
    let observationID = "item-" + uuidv4();
    fhir.entry[2].resource.result.push({reference: "Observation/" + observationID});
    observation.fullUrl = "http://spms.min-saude.pt/fhir/Observation/" + observationID;
    observation.resource.id = observationID;
    observation.resource.subject.reference = "Patient/" + composition["items.0.0.items.0.items.0.value"];
    delete observation.resource.interpretation;
    delete observation.resource.referenceRange;

    fhir.entry.splice(3+i, 0, observation);
  }

  // Practitioner
  // ID
  fhir.entry[3+observation_list.length].resource.id = user.id;
  fhir.entry[3+observation_list.length].resource.identifier[0].value = user.id;
  // Nome
  fhir.entry[3+observation_list.length].resource.name[0].text = user.name;
  // Metadados
  fhir.entry[3+observation_list.length].fullUrl = "http://spms.min-saude.pt/fhir/Practitioner/" + user.id;

  // Coverage
  fhir.entry.splice(4+observation_list.length, 1)

  // Organization
  fhir.entry.splice(fhir.entry.length-1)

  return fhir;
};



module.exports = {parseNestedJSON, incrementVersionNumber, compositionToFHIR, removeBlocks};