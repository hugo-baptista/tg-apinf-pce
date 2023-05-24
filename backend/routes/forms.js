var express = require('express');
var router = express.Router();
var UserModel = require('../model/User')
var FormModel = require('../model/Form');
var FormController = require('../controller/Form');
const { parseNestedJSON, incrementVersionNumber, removeBlocks } = require('../static/functions')

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

      let newFormResponse = await FormController.newForm(new_composition_id, sandardized_composition);
      if (newFormResponse.success) {
        res.status(200).json({success: true, info: "FormComposition adicionado com sucesso!"});
      } else {
        res.status(200).json({success: false, info: "Erro ao adicionar FormComposition!"});
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
        FormModel.find()
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

router.post('/:id', async (req, res) => {
  const {current_user} = req.body;
  const {username, password} = current_user;

  UserModel.findOne({username, password})
  .then(async user => {
    if (user) {
      if (user.permissions.create_forms_fhir) {
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
