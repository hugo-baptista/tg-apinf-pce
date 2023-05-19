var mongoose=require('mongoose');
var Schema = mongoose.Schema;
var { v4: uuidv4 } = require('uuid');

var UserSchema =  new Schema({
    id: {type: String, default: uuidv4, unique: true},
    username: {type: String, required:true, unique:true},
    password: {type: String, required:true},
    name: {type: String, required:true},
    code: {type: Number, required:true},
    designation: {type: String, required:true},
    permissions: {
        create_users: {type: Boolean, required:true},
        create_forms: {type: Boolean, required:true},
        view_forms: {type: Boolean, required:true},
        view_fhir: {type: Boolean, required:true}
    }
})

module.exports = mongoose.model('User', UserSchema)