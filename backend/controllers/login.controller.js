// Simular users e passwords da base de dados
const users = require("./users_db");

var express = require('express');
var router = express.Router();  

router.get('/', function(req, res, next) {
    // input username (req.body.username) e password (req.body.password)
    console.log(users)
    for(let i=0; i<users.length; i++){
        console.log(users[i])
        if (req.body.username == users[i].username && req.body.password == users[i].password) {
            res.send('Log in was successful');
        }
    }
    res.send('Username or password are wrong');
});

module.exports = router;