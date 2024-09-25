const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 2000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('MongoDB URI is not defined in the environment variables');
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log('MongoDB connection error:', err));

// Mongoose Schema and Model
const FormDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  address: String,
  role: String,
  companyName: String,
  recipient: String,
  post: String,
  companyExperience: String,
  jobDescription: String,
  relevantSkills: String,
  degree: String,
  higherSecondary: String,
  secondary: String,
  whyGreatFit: String,
  callToAction: String,
  closing: String,
  softSkills: String,
  technicalSkills: String,
  otherSkills: String,
  coverLetterContent: String,
});

const FormData = mongoose.model('FormData', FormDataSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.post('/submit', async (req, res) => {
  const formData = new FormData(req.body);

  try {
    await formData.save();
    res.status(201).send('Form data saved successfully');
  } catch (error) {
    res.status(400).send('Error saving form data: ' + error.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
