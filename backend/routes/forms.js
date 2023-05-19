var express = require('express');
var router = express.Router();

var UserModel = require('../model/User')
var FormModel = require('../model/Form');
var FormController = require('../controller/Form');

const fs = require('fs');

router.post('/submit', async (req, res) => {
  const {current_user} = req.body;
  
  const {username, password} = current_user;
  UserModel.findOne({username, password})
  .then(async user => {
    if (user.permissions.create_forms) {
      const {composition} = req.body;
      console.log(composition);
      

      let newFormResponse = await FormController.newForm(JSON.parse(composition));
      if (newFormResponse.success) {
        res.status(200).json({success: true, info: "FormComposition adicionado com sucesso!"});
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
  })
  .catch(err => {
    res.json(err);
  })
});

module.exports = router;
