var express = require('express');
var router = express.Router();

var UserModel = require('../model/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
