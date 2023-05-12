const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/forms', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Route handler to save form submissions to MongoDB
app.post('/api/form-submissions', (req, res) => {
  const submissionData = req.body;
  // Save submission data to MongoDB using Mongoose
  const submissionModel = mongoose.model('FormSubmission', new mongoose.Schema({}, { strict: false }));
  const submission = new submissionModel(submissionData);
  submission.save((err, savedSubmission) => {
    if (err) {
      console.error('Error saving form submission:', err);
      res.status(500).send('Error saving form submission');
    } else {
      console.log('Saved form submission:', savedSubmission);
      res.json(savedSubmission);
    }
  });
});

app.listen(3001, () => console.log('Server listening on port 3001'));