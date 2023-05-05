var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var UserSchema =  new Schema({
    username: {type: String, unique:true},
    password: {type: String},
    code: {type: Number},
    designation: {type: String},
    permissions: {
        create_users: {type: Boolean},
        create_forms: {type: Boolean},
        view_forms: {type: Boolean}
    }
})

module.exports = mongoose.model('User', UserSchema)