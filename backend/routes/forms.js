var express = require('express');
var router = express.Router();
var UserModel = require('../model/User')
var FormModel = require('../model/Form');
var FormController = require('../controller/Form');
var FhirController = require('../controller/Fhir');
const { parseNestedJSON, incrementVersionNumber, removeBlocks, compositionToFHIR } = require('../static/functions')

router.post('/submit', async (req, res) => {
  const {current_user} = req.body;
  const {username, password} = current_user;
  
  UserModel.findOne({username, password})
  .then(async user => {
    if (user.permissions.create_forms_fhir) {
      let {composition_id} = req.body; 
      let new_composition_id = await incrementVersionNumber(composition_id);

      const {composition} = req.body;
      const composition_json = parseNestedJSON(composition);
      const sandardized_composition = removeBlocks(composition_json);

      // Criar o Form
      let newFormResponse = await FormController.newForm(new_composition_id, sandardized_composition, username);
      if (newFormResponse.success) {
        // Criar o FHIR
        FormModel.findOne({id: new_composition_id})
          .then(async form => {
              if (form) {
                  const {composition} = form;
  
                  let fhir_message = compositionToFHIR(new_composition_id, composition, user, form.updatedAt);
  
                  let newFhirResponse = await FhirController.newFhir(new_composition_id, fhir_message);
  
                  // Resposta
                  if (newFhirResponse.success) {
                      res.status(200).json({success: true, info: "FormComposition e FhirMessage adicionados com sucesso!"});
                  } else {
                      res.status(200).json({success: false, info: "Erro ao adicionar FhirMessage!"});
                      console.log(newFhirResponse.response);
                  };
              } else {
                  res.status(200).json({success: false, info: "FormID não existe!"});
              }
          })
      } else {
        res.status(200).json({success: false, info: "Erro ao adicionar FormComposition!"});
        console.log(newFormResponse.response);
      };

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
    if (user) {
      if (user.permissions.view_forms) {
        FormModel.find({active: "true"})
        .then(async forms => {
          res.status(200).json({success: true, forms: forms});
        })
        .catch(err => {
          res.status(200).json({success: false, info: err});
        })
      } else {
        res.status(200).json({success: false, info: "Não tem permissões!"});
      }
    } else {
      UserModel.findOne({username})
      .then(user => {
        if (user) {
          res.json({success: false, info: "Password errada!"});
        } else {
          res.json({success: false, info: "Utilizador não existe!"});
        }
      })
    }
  })
  .catch(err => {
    res.json(err);
  })
});

router.post('/delete/:id', async (req, res) => {
  const {current_user} = req.body;
  const {username, password} = current_user;

  UserModel.findOne({username, password})
  .then(async user => {
    if (user) {
      if (user.permissions.create_forms_fhir) {
        let deleteFormResponse = await FormController.deleteForm(req.params.id);
        let deleteFhirResponse = await FhirController.deleteFhir(req.params.id);

        if (deleteFormResponse.success && deleteFhirResponse.success) {
          res.status(200).json({success: true, info: "FormComposition e FhirMessage apagados com sucesso!"});
        } else if (deleteFormResponse.success) {
          res.status(200).json({success: true, info: "Apenas FhirMessage apagado!"});
        } else {
          res.status(200).json({success: true, info: "Apenas FormComposition apagado!"});
        }
      } else {
        res.status(200).json({success: false, info: "Não tem permissões!"});
      }
    } else {
      UserModel.findOne({username})
      .then(user => {
        if (user) {
          res.json({success: false, info: "Password errada!"});
        } else {
          res.json({success: false, info: "Utilizador não existe!"});
        }
      })
    }
  })
  .catch(err => {
    res.json(err);
  })
});

router.post('/:id', async (req, res) => {
  const {current_user} = req.body;
  const {username, password} = current_user;
  UserModel.findOne({username, password})
  .then(async user => {
    if (user) {
      if (user.permissions.view_forms) {
        FormModel.find({id: req.params.id})
        .then(async form => {
          res.status(200).json({success: true, form: form});
        })
        .catch(err => {
          res.status(200).json({success: false, info: err});
        })
      } else {
        res.status(200).json({success: false, info: "Não tem permissões!"});
      }
    } else {
      UserModel.findOne({username})
      .then(user => {
        if (user) {
          res.json({success: false, info: "Password errada!"});
        } else {
          res.json({success: false, info: "Utilizador não existe!"});
        }
      })
    }
  })
  .catch(err => {
    res.json(err);
  })
});

module.exports = router;
