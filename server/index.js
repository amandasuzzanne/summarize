require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer'); // For file upload
const path = require('path');
const fs = require('fs');
const summariesRoutes = require('./api/summaries'); // Import the routes from summaries.js
const processFileRoutes = require('./api/process-file');

const app = express();       

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json()); // Use express's built-in JSON parser

// Use routes
app.use('/api/summaries', summariesRoutes); // Existing route
app.use('/api', processFileRoutes);  

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));













// const express = require('express');
// const app = express();
// app.get('/', (req, res) => {
//     res.send('Simple API homepage');
// })
// app.listen(5000, () => {
//     console.log("Server running on port 5000");
// })