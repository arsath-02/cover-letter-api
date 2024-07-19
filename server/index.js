const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const { Document } = require('docx');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');

const app = express();
const port = 5000;

// Set up storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle JSON requests
app.use(express.json());

// Convert buffer to readable stream
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {}; // _read is required but you can noop it
  readable.push(buffer);
  readable.push(null);
  return readable;
};

// Function to extract text from a PDF file
const extractTextFromPDF = async (buffer) => {
  const pdfDoc = await PDFDocument.load(buffer);
  const pages = pdfDoc.getPages();
  const textPromises = pages.map(async (page) => page.getTextContent());
  const textContents = await Promise.all(textPromises);
  return textContents.map(textContent => textContent.items.map(item => item.str).join(' ')).join('\n');
};

// Function to extract text from a DOCX file
const extractTextFromDOCX = async (buffer) => {
  const doc = new Document(buffer);
  const text = doc.getBody().getText();
  return text;
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

// Endpoint for extracting information from the uploaded file
app.post('/extract_info', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let extractedText = '';

    if (file.mimetype === 'application/pdf') {
      extractedText = await extractTextFromPDF(file.buffer);
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extractedText = await extractTextFromDOCX(file.buffer);
    } else if (file.mimetype.startsWith('image/')) {
      extractedText = await extractTextFromImage(file.buffer);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    // Process the extracted text to structure it if necessary
    const extractedInfo = {
      text: extractedText,
      // You can add additional text processing logic here
    };

    res.json({
      message: 'File uploaded and information extracted successfully',
      extracted_info: extractedInfo
    });
  } catch (error) {
    console.error('Error extracting information:', error);
    res.status(500).json({ error: 'Failed to extract information from the file. Please try again.' });
  }
});

// Serve the React frontend
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
