const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getUserByUsernameAndPassword } = require('./login-handler');
const { createConnection } = require('./connection-database');
const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

// Login API
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

// Get User Data API
app.post('/api/user-data', (req, res) => {
    const { username } = req.body;

    const connection = createConnection();
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
//Location API 
app.get('/api/locations', (req, res) => {
    const connection = createConnection();
    const query = 'SELECT LocationID, City FROM locations';

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching locations:", err.message);
            res.status(500).send("Error fetching locations.");
        } else {
            res.status(200).json(results);
        }

        connection.end();
    });
});

//Categories API 
app.get('/api/categories', (req, res) => {
    const connection = createConnection();
    const query = 'SELECT CategoryID, Name FROM categories';

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching categories:", err.message);
            res.status(500).send("Error fetching categories.");
        } else {
            res.status(200).json(results);
        }

        connection.end();
    });
});




// Register API
app.post('/api/register', (req, res) => {
    const {
        firstName,
        lastName,
        dob,
        phoneNumber,
        address,
        mail,
        username,
        password,
    } = req.body;

    console.log("Data received:", req.body); // Log per verificare i dati

    if (!mail || !username || !password) {
        res.status(400).send("Mail, username, and password are required.");
        return;
    }

    const connection = createConnection();

    const checkQuery = 'SELECT Mail FROM users WHERE Mail = ?';
    connection.query(checkQuery, [mail], (err, results) => {
        if (err) {
            console.error("Error checking for duplicate mail:", err.message);
            res.status(500).send("Error checking for duplicate mail.");
            connection.end();
        } else if (results.length > 0) {
            res.status(400).send("The provided email is already in use.");
            connection.end();
        } else {
            const insertQuery = `
                INSERT INTO users (FirstName, LastName, DoB, TelephoneNumber, Address, Mail, Username, Password, IsHost)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            connection.query(
                insertQuery,
                [firstName, lastName, dob, phoneNumber, address, mail, username, password, 0],
                (insertErr, insertResults) => {
                    if (insertErr) {
                        console.error("Error registering user:", insertErr.message);
                        res.status(500).send("Error registering user.");
                    } else {
                        res.status(200).send("User registered successfully!");
                    }

                    connection.end();
                }
            );
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
