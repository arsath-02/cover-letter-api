const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const { Readable } = require('stream');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = 5000;

// Set up storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle JSON requests
app.use(express.json());
const cors = require('cors');
app.use(cors());

// Convert buffer to readable stream
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {}; // _read is required but you can noop it
  readable.push(buffer);
  readable.push(null);
  return readable;
};

// Function to extract text from a PDF file using pdf-parse
const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to extract text from PDF');
  }
};

// Function to extract text from images using Tesseract
const extractTextFromImage = async (buffer) => {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(
      bufferToStream(buffer),
      'eng',
      {
        logger: info => console.log(info) // Optional: Log progress
      }
    ).then(({ data: { text } }) => resolve(text))
      .catch(reject);
  });
};

// Replace this with your actual ngrok URL
const ngrokURL = 'https://2543-34-44-211-240.ngrok-free.app';

// Endpoint for extracting information from the uploaded file
app.post('/extract_info', upload.single('file'), async (req, res) => {
  console.log('Received file upload request');
  try {
    const file = req.file;
    if (!file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File uploaded:', file.originalname);

    let extractedText = '';

    if (file.mimetype === 'application/pdf') {
      extractedText = await extractTextFromPDF(file.buffer);
    } else if (file.mimetype.startsWith('image/')) {
      extractedText = await extractTextFromImage(file.buffer);
    } else {
      console.log('Unsupported file type');
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    console.log('Extracted text:', extractedText);

    try {
      const response = await fetch(`${ngrokURL}/generate_cover_letter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: extractedText })
      });

      if (response.ok) {
        const data = await response.json();
        res.json({
          message: 'File uploaded and information extracted successfully',
          extracted_info: data
        });
      } else {
        const errorData = await response.json();
        console.error('Error from Flask server:', errorData);
        res.status(response.status).json(errorData);
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
      res.status(500).json({ error: 'Failed to generate cover letter. Please try again.' });
    }
  } catch (error) {
    console.error('Error extracting information:', error);
    res.status(500).json({ error: 'Failed to extract information from the file. Please try again.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

