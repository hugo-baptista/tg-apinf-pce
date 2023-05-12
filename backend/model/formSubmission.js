const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema({
  ID: String,
}, { timestamps: true });

const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

module.exports = FormSubmission;
