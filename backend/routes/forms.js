var express = require('express');
var router = express.Router();

var UserModel = require('../model/User')
var FormModel = require('../model/Form');
var FormController = require('../controller/Form');

const fs = require('fs');

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

router.post('/submit', async (req, res) => {
  const {current_user} = req.body;
  
  const {username, password} = current_user;
  UserModel.findOne({username, password})
  .then(async user => {
    if (user.permissions.create_forms_fhir) {
      const {composition} = req.body;

      const composition_json = parseNestedJSON(composition)

      let newFormResponse = await FormController.newForm(composition_json);
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
