const express = require('express');
const router = express.Router();
const connection = require('../db'); // Import the database connection


router.post('/', (req, res) => {
    try {
        const { summary_text, original_text, file_name, file_path } = req.body;
        console.log('Request body:', req.body);  // Log the request body

        if (!summary_text || !original_text) {
            return res.status(400).json({ message: 'Missing summary_text or original_text' });
        }

        let query = 'INSERT INTO summaries (summary_text, original_text';
        let values = [summary_text, original_text];

        if (file_name && file_path) {
            console.log('File name and path received:', file_name, file_path);  // Log the file details
            query += ', file_name, file_path) VALUES (?, ?, ?, ?)';
            values.push(file_name, file_path);
        } else {
            query += ') VALUES (?, ?)';
        }

        connection.query(query, values, (err, result) => {
            if (err) {
                console.error('Database error:', err);  // Log database errors
                return res.status(500).json({ message: 'Error creating summary' });
            }
            res.status(201).json({ message: 'Summary added successfully', id: result.insertId });
        });
    } catch (error) {
        console.error('Server error:', error);  // Log server errors
        res.status(500).json({ message: 'Server error' });
    }      
});


// READ: Get all summaries
router.get('/', (req, res) => {
    const query = 'SELECT * FROM summaries';

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving summaries' });
        }
        res.status(200).json(results);
    });
});

// READ: Get a specific summary by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM summaries WHERE id = ?';

    connection.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving summary' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Summary not found' });
        }
        res.status(200).json(result[0]);
    });
});

// UPDATE: Update a summary 
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { summary_text, original_text } = req.body;
    const query = 'UPDATE summaries SET summary_text = ?, original_text = ? WHERE id = ?';

    connection.query(query, [summary_text, original_text, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating summary' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Summary not found' });
        }
        res.status(200).json({ message: 'Summary updated successfully' });
    });
});

// DELETE: Remove a summary by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM summaries WHERE id = ?';

    connection.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting summary' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Summary not found' });
        }
        res.status(200).json({ message: 'Summary deleted successfully' });
    });
});

module.exports = router;
