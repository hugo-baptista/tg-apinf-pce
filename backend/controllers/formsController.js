const express = require('express');
const router = express.Router();
const FormSubmission = require('../models/FormSubmission');

router.post('/form-submissions', async (req, res) => {
  try {
    const formSubmission = new FormSubmission(req.body);
    const savedFormSubmission = await formSubmission.save();
    res.json(savedFormSubmission);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving form submission');
  }
});

module.exports = router;