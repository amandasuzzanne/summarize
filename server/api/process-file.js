const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/'  // Directory to save uploaded files
});

// API route to handle file upload
app.post('/api/process-file', upload.single('file'), async (req, res) => {
  try {
    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Path to the uploaded file
    const filePath = path.join(__dirname, 'uploads', req.file.filename);

    // Read the file contents (optional, based on API requirements)
    const fileData = fs.readFileSync(filePath);

    // Send the file to Google Cloud Document AI (Gemini) or any other API
    const apiResponse = await axios.post('https://documentai.googleapis.com/v1beta3/projects/YOUR_PROJECT_ID/locations/YOUR_LOCATION/processors/YOUR_PROCESSOR_ID:process', {
      // You can send the file data here if needed (depends on API requirements)
      document: {
        content: fileData.toString('base64'),  // Convert file to Base64 if required by the API
        mimeType: req.file.mimetype
      }
    }, {
      headers: {
        'Authorization': `Bearer YOUR_ACCESS_TOKEN`,  // Google API token
        'Content-Type': 'application/json'
      }
    });

    // Handle the API response and return it to the client
    return res.json({ success: true, data: apiResponse.data });

  } catch (error) {
    console.error('Error processing file:', error);
    return res.status(500).json({ error: 'Error processing file' });
  }
});

// Start the Express server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
