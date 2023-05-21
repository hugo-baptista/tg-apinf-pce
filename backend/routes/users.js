var express = require('express');
var router = express.Router();

var UserModel = require('../model/User');
var UserController = require('../controller/User');
var UserTypeModel = require('../model/UserType');

router.get('/types', function(req, res, next) {
  var user_types_list = [];
  UserTypeModel.find({})
  .then(async user_types => {
    user_types.map(user_type => {
      user_types_list.push({
        code: user_type.code,
        designation: user_type.designation
      })
    })
    res.status(200).json(user_types_list);
  })
  .catch(err => {
    console.log(err);
  });
});

router.post('/list', async (req, res) => {
  const {current_user} = req.body;
  const {username, password} = current_user;

  UserModel.findOne({username, password})
  .then(async user => {
    if (user.permissions.create_users) {
      UserModel.find()
      .then(async users => {
        res.status(200).json({success: true, users: users});
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

router.post('/create', async function(req, res, next) {
  const {current_user} = req.body;
  
  const {username, password} = current_user;
  UserModel.findOne({username, password})
  .then(async user => {
    if (user.permissions.create_users) {
      const {new_user} = req.body;

      UserTypeModel.findOne({code: new_user.code})
      .then(async user_type => {
        let newUserResponse = await UserController.newUser(
          new_user.username,
          new_user.password,
          new_user.name,
          user_type.code,
          user_type.designation,
          user_type.permissions.create_users,
          user_type.permissions.create_forms_fhir,
          user_type.permissions.view_forms,
          user_type.permissions.view_fhir)
          
        if (newUserResponse.success) {
          res.status(200).json({success: true, info: "User adicionado com sucesso!"});
        } else {
          res.status(200).json({success: false, info: "Erro ao adicionar User!"});
        };
      })
      .catch(err => {
        res.json(err);
      })
    } else {
      res.status(200).json({success: false, info: "Não tem permissões!"});
    }
  })
  .catch(err => {
    res.json(err);
  })
});

router.put('/validate', (req, res) => {
  const {username, password} = req.body;
  UserModel.findOne({username, password})
  .then(user => {
    if (user) {
      res.json({user});
    } else {
      UserModel.findOne({username: req.body.username})
      .then(user => {
        if (user) {
          res.json({password_error: true});
        } else {
          res.json({username_error: true});
        }
      })
    }
  })
  .catch(err => {
    res.json(err);
  })
});

module.exports = router;
