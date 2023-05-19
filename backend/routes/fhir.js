var express = require('express');
var router = express.Router();

var UserModel = require('../model/User')
var FormModel = require('../model/Form');
var FhirModel = require('../model/Fhir');
var FhirController = require('../controller/Fhir');

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
                var fhir_message = require('../static/fhir_analises.json');

                // Alterar informação na mensagem FHIR:
                const current_date = new Date();
                
                // Paciente - ID, Nome, Género, Data Nascimento, Morada
                fhir_message.entry[1].resource.name[0].text = composition["items.0.0.items.0.items.0.value"].blocks[0].text;
                fhir_message.entry[1].resource.gender = composition["items.0.0.items.0.items.3.value"].text;
                fhir_message.entry[1].resource.birthDate = composition["items.0.0.items.0.items.2.items.0.value.date"];
                fhir_message.entry[1].resource.address[0].text = composition["items.0.0.items.0.items.1.items.0.value"].blocks[0].text;
                
                // Diagnostic Report - Categoria, Código, Conclusão
                fhir_message.entry[2].resource.category.coding[1].code = composition["items.0.1.items.0.value"].code.replace(/local_terms::/g, "");
                fhir_message.entry[2].resource.category.coding[1].display = composition["items.0.1.items.0.value"].text;
                fhir_message.entry[2].resource.code.coding = [];
                for (let i=0; i<composition["items.0.1.items.1.value"].length; i++) {
                  fhir_message.entry[2].resource.code.coding.push({
                    code: composition["items.0.1.items.1.value"][i].code.replace(/local_terms::/g, ""),
                    display: composition["items.0.1.items.1.value"][i].text
                  })
                }
                fhir_message.entry[2].resource.conclusion = composition["items.0.1.items.3.value"].blocks[0].text;
                
                // Observation - Método/Código, Valor, Técnico (ID e Nome), Data Aquisição
                
                // Practitioner - User com sessão iniciada
                
                // Organization
                
                // Metadados - Data da última atualização, ID
                fhir_message.id = composition_id;
                fhir_message.meta.lastUpdated = current_date;

                res.status(200).json({success: true, composition, fhir_message});

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
