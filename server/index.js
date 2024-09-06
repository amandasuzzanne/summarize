require('dotenv').config();

const express = require('express');
const cors = require('cors');
const summariesRoutes = require('./api/summaries'); // Import the routes from summaries.js
const connection = require('./db'); // Import the database connection

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this if your client is hosted elsewhere
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));
app.use(express.json()); // Use express's built-in JSON parser

// Use routes
app.use('/api/summaries', summariesRoutes); // Prefix for routes defined in summaries.js

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
