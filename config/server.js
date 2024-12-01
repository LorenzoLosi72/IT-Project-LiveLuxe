const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getUserByUsernameAndPassword } = require('./login-handler'); 
const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    getUserByUsernameAndPassword(username, password, (err, user) => {
        if (err) {
            res.status(500).send("Error retrieving user.");
        } else if (user.length === 0) {
            res.status(401).send("Invalid username or password.");
        } else {
            res.status(200).json(user[0]);
        }
    });
});

app.post('/api/user-data', (req, res) => {
    const { username } = req.body;

    const connection = require('./connection-database').createConnection();
    const query = `
        SELECT 
            UserId AS userid,
            Username AS username, 
            Mail AS mail, 
            FirstName AS firstName, 
            LastName AS lastName, 
            DoB AS dob, 
            Address AS address, 
            TelephoneNumber AS telephoneNumber, 
            IsHost AS isHost 
        FROM users 
        WHERE Username = ?`;

    connection.query(query, [username], (err, results) => {
        if (err) {
            console.error("Error fetching user data:", err.message);
            res.status(500).send("Error retrieving user data.");
        } else if (results.length === 0) {
            res.status(404).send("User not found.");
        } else {
            res.status(200).json(results[0]);
        }

        connection.end();
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
