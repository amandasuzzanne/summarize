require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer'); // For file upload
const path = require('path');
const fs = require('fs');
const summariesRoutes = require('./api/summaries'); // Import the routes from summaries.js
const { summarizePdf } = require('./pdfProcessor'); // Import your PDF processing function


const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this if your client is hosted elsewhere
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));
app.use(express.json()); // Use express's built-in JSON parser

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' }); // Directory to temporarily store uploaded files

// Handle file upload and processing
app.post('/api/files', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = path.join(__dirname, 'uploads', req.file.filename);

        // Process the PDF and get a summary
        const summary = await summarizePdf(filePath);

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.status(200).json({ summary });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'Error processing file' });
    }
});


// Use routes
app.use('/api/summaries', summariesRoutes); // Prefix for routes defined in summaries.js

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
