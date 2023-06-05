var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FormSchema = new Schema({
  id: {type: String, unique: true, required: true},
  composition: {type: Schema.Types.Mixed, required: true},
  active: {type: Boolean, default: "true"},
  creator: {type: String, required: true}
}, { timestamps: true });

module.exports = mongoose.model('Form', FormSchema)