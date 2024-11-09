// import mysql package
let mysql = require('mysql');

// configuring database connection parameters
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'liveluxe'
});

// database connection
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to mySQL database.")
});

// close database connection
connection.end();