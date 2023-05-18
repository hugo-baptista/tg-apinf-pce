var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var formsRouter = require('./routes/forms')

var cors = require('cors');

const mongoose = require('mongoose');
const uri = "mongodb://localhost:9000/analises";

var app = express();

app.use(cors())

mongoose.set('strictQuery', true);
mongoose.connect(uri)
  .then(() => console.log('Connected.'))
  .catch(() => console.log('Error connecting to MongoDB.'))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/forms', formsRouter);

module.exports = app;

const startingData = require('./controller/startingData');

// Criar tipos de utilizadores caso não exista nenhum
const UserTypeModel = require('./model/UserType');
UserTypeModel.findOne()
.then(user_type => {
  if (!user_type) {
    startingData.createBaseTypes();
  }
})
.catch(err => {
  console.log(err);
});

// Criar utilizadores base caso não exista nenhum utilizador
const UserModel = require('./model/User');
UserModel.findOne()
.then(user => {
  if (!user) {
    startingData.createBaseUsers();
  }
})
.catch(err => {
  console.log(err);
});