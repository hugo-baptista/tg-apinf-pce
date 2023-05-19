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
                // Metadados - Data da última atualização, ID
                fhir_message.id = composition_id;
                const current_date = new Date();
                fhir_message.meta.lastUpdated = current_date;

                // Paciente - ID, Nome, Género, Data Nascimento, Morada
                // fhir_message.entry[1].resource.name[0].text = composition.items.0.0.items.0.items.0;

                // Diagnostic Report - Categoria, Código, Conclusão

                // Observation - Método/Código, Valor, Técnico (ID e Nome), Data Aquisição

                // Practitioner - User com sessão iniciada

                // Organization

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
