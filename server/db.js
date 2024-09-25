require('dotenv').config(); // load env file
// const mysql = require('mysql2');

// const connection = mysql.createConnection({

// import Postgre Client
const { Client } = require('pg'); 

const connection = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,    
    user: process.env.DB_USER,  
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
});

connection.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = connection;
