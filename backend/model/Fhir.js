var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FhirSchema = new Schema({
  id: {type: String, unique: true, required: true},
  message: {type: Schema.Types.Mixed, required: true}
}, { timestamps: true });

module.exports = mongoose.model('Fhir', FhirSchema)