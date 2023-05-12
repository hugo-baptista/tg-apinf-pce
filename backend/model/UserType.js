var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var UserTypeSchema =  new Schema({
    code: {type: Number, required:true},
    designation: {type: String, required:true},
    permissions: {
        create_users: {type: Boolean, required:true},
        create_forms: {type: Boolean, required:true},
        view_forms: {type: Boolean, required:true},
        view_fhir: {type: Boolean, required:true}
    }
})

module.exports = mongoose.model('UserType', UserTypeSchema)