var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var { v4: uuidv4 } = require('uuid');

var FormSchema = new Schema({
  id: {type: String, default: uuidv4()},
  composition: {type: Schema.Types.Mixed, required: true}
}, { timestamps: true });

module.exports = mongoose.model('Form', FormSchema)