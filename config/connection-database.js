// Import mysql package
let mysql = require('mysql');

// Function for creating connection to the database
function createConnection() {
    // Configuring database connection parameters
    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'liveluxe'
    });

    // Database connection
    connection.connect(function(err) {
        if (err) {
            console.error("Connection failed: " + err.message);
        } else {
            console.log("Connected successful");
        }
    });

    return connection;
}

// Call the function directly for testing purposes
createConnection();


// Export the function (optional, if needed in other files)
module.exports = { createConnection };
