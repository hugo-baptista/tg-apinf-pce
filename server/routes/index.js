// Pedir usernames e passwords
const { username, password } = require("../../users");

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    // input username e password - req.body.username e req.body.password
    if (req.body.username == username && req.body.password == password) {
        res.send('Log in was successful');
    } else {
        res.send('Username or password are wrong');
    }
});

module.exports = router;