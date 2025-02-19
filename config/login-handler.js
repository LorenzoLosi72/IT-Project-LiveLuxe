const { createConnection } = require('./connection-database');

function getUserByUsernameAndPassword(username, password, callback) {
    const connection = createConnection();
    const query = `SELECT UserID, Username, IsHost, FirstName, LastName FROM users WHERE Username = ? AND Password = ?`;

    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error("Error fetching user:", err.message);
            callback(err, null);
        } else {
            
            if (results.length === 0) {
                callback(null, []);
            } else {
                callback(null, results);  
            }
        }
        connection.end();
    });
}

module.exports = { getUserByUsernameAndPassword };
