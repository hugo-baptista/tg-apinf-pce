var express = require('express');
var router = express.Router();

var UserModel = require('../model/User')
var FormModel = require('../model/Form');
var FhirModel = require('../model/Fhir');
var FhirController = require('../controller/Fhir');

function compositionToFHIR(composition_id, composition, user) {
  var fhir_message = require('../static/fhir_analises.json');

  // Alterar informação na mensagem FHIR:

    // Dados                
  // Paciente - ID, Nome, Género, Data Nascimento, Morada
  fhir_message.entry[1].resource.name[0].text = composition["items.0.0.items.0.items.0.value"].blocks[0].text;
  fhir_message.entry[1].resource.gender = composition["items.0.0.items.0.items.3.value"].text;
  fhir_message.entry[1].resource.birthDate = composition["items.0.0.items.0.items.2.items.0.value.date"];
  fhir_message.entry[1].resource.address[0].text = composition["items.0.0.items.0.items.1.items.0.value"].blocks[0].text;
  
  // Diagnostic Report - Categoria, Código, Conclusão
  // Categoria
  fhir_message.entry[2].resource.category.coding[1].code = composition["items.0.1.items.0.value"].code.replace(/local_terms::/g, "");
  fhir_message.entry[2].resource.category.coding[1].display = composition["items.0.1.items.0.value"].text;
  // Código
  fhir_message.entry[2].resource.code.coding = [];
  let code_list = composition["items.0.1.items.1.value"];
  for (let i=0; i<code_list.length; i++) {
    fhir_message.entry[2].resource.code.coding.push({
      code: code_list[i].code.replace(/local_terms::/g, ""),
      display: code_list[i].text
    })
  };
  // Conclusão
  fhir_message.entry[2].resource.conclusion = composition["items.0.1.items.3.value"].blocks[0].text;
  
  // Observation - Método/Código, Valor, Técnico (ID e Nome), Data Aquisição
  const base_observation = fhir_message.entry[4];
  fhir_message.entry.splice(3, 9);
  const observation_list = composition["items.0.1.items.2.value"];
  for (let i=0; i<observation_list.length; i++) {
    let observation = JSON.parse(JSON.stringify(base_observation));
    // Método/Código
    observation.resource.code.coding[0].code = observation_list[i].values["items.0.1.items.2.items.0.value"].code.replace(/local_terms::/g, "");
    observation.resource.code.coding[0].display = observation_list[i].values["items.0.1.items.2.items.0.value"].text;
    // Valor
    observation.resource.valueQuantity.value = observation_list[i].values["items.0.1.items.2.items.1.value"].blocks[0].text;
    // Técnico (ID e Nome)
    observation.resource.performer[0].reference = "Practitioner/"+observation_list[i].values["items.0.1.items.2.items.2.items.1.value"].blocks[0].text;
    observation.resource.performer[0].display = observation_list[i].values["items.0.1.items.2.items.2.items.0.value"].blocks[0].text;
    // Data Aquisição
    const date = observation_list[i].values["items.0.1.items.2.items.3.value.date"];
    const time = observation_list[i].values["items.0.1.items.2.items.3.value.time"];
    const combinedDateTime = `${date}T${time}:00`;
    const dateTime = new Date(combinedDateTime);
    observation.resource.effectiveDateTime = dateTime;

    fhir_message.entry.splice(3+i, 0, observation);
  }
  
  // Practitioner - User com sessão iniciada
  fhir_message.entry[3+observation_list.length].resource.id = user.id;
  fhir_message.entry[3+observation_list.length].resource.identifier[0].value = user.id;
  fhir_message.entry[3+observation_list.length].resource.name[0].text = user.name;
  
  // Organization
  fhir_message.entry.splice(fhir_message.entry.length-1)
  
    // Metadados
  // Data da última atualização, ID
  const current_date = new Date();
  fhir_message.meta.lastUpdated = current_date;
  fhir_message.id = composition_id;

  return fhir_message;
}

router.post('/create', async (req, res) => {
  const {current_user} = req.body;
  
  const {username, password} = current_user;
  UserModel.findOne({username, password})
  .then(async user => {
    if (user.permissions.create_forms_fhir) {
        const {composition_id} = req.body;
        FormModel.findOne({id: composition_id})
        .then(async form => {
            if (form) {
                const {composition} = form;

                let fhir_message = compositionToFHIR(composition_id, composition, user);

                res.status(200).json({success: true, fhir_message});

                // let newFhirResponse = await FhirController.newFhir(message);
                // if (newFhirResponse.success) {
                //     res.status(200).json({success: true, info: "FhirMessage adicionado com sucesso!"});
                // } else {
                //     res.status(200).json({success: false, info: "Erro ao adicionar FhirMessage!"});
                //     console.log(newFhirResponse.response);
                // };
            } else {
                res.status(200).json({success: false, info: "FormID não existe!"});
            }
        })
    } else {
      res.status(200).json({success: false, info: "Não tem permissões!"});
    }
  })
  .catch(err => {
    res.json(err);
  })
});

router.post('/list', async (req, res) => {
  const {current_user} = req.body;
  
  const {username, password} = current_user;
  UserModel.findOne({username, password})
  .then(async user => {
    if (user.permissions.view_fhirs) {
      FhirModel.find()
      .then(async fhirs => {
        res.status(200).json({success: true, fhirs: fhirs});
      })
      .catch(err => {
        res.status(200).json({success: false, info: err});
      })
    } else {
      res.status(200).json({success: false, info: "Não tem permissões!"});
    }
  })
  .catch(err => {
    res.json(err);
  })
});

module.exports = router;
