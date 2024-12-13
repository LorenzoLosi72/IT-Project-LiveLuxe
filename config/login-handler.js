const { createConnection } = require('./connection-database');

function getUserByUsernameAndPassword(username, password, callback) {
    const connection = createConnection();
    const query = `SELECT Username, IsHost FROM users WHERE username = ? AND password = ?`;
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error("Error fetching user:", err.message);
            callback(err, null);
        } else {
            callback(null, results); 
        }
        connection.end();
    });
}

module.exports = { getUserByUsernameAndPassword };
