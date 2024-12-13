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
            res.status(200).json({
                username: user[0].Username,
                isHost: user[0].IsHost, 
            });
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

// Location API
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

// Categories API
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
        isHost, 
    } = req.body;

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
                [firstName, lastName, dob, phoneNumber, address, mail, username, password, isHost],
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


// Register Property API
app.post('/api/register-property', (req, res) => {
    const {
        name,
        bedrooms,
        kitchen,
        parking,
        pool,
        wifi,
        airConditioning,
        notes,
        address,
        locationID,
        categoryID,
        guestsNumber,
        userID 
    } = req.body;

    if (!userID) {
        res.status(400).send("UserID is required to register a property.");
        return;
    }

    const connection = createConnection();
    const query = `
        INSERT INTO properties 
        (Name, Bedrooms, Kitchen, Parking, Pool, WIFI, AirConditioning, Notes, Address, UserID, LocationID, CategoryID, GuestsNumber)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(
        query,
        [
            name,
            bedrooms,
            kitchen,
            parking,
            pool,
            wifi,
            airConditioning,
            notes || null,
            address,
            userID,
            locationID,
            categoryID,
            guestsNumber,
        ],
        (err, results) => {
            if (err) {
                console.error("Error registering property:", err.message);
                res.status(500).send("Error registering property.");
            } else {
                res.status(200).send("Property registered successfully!");
            }

            connection.end();
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
