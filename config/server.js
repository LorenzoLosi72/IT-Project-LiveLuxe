const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { createConnection } = require('./connection-database'); // Function for creating database connection.
const { getUserByUsernameAndPassword } = require('./login-handler'); // Function for login.

const app = express();
const PORT = 3001; // Defining the port on which the server listens.

app.use(bodyParser.json());
app.use(cors());

// Login API
app.post('/api/login', (req, res) => {

    // Extract credentials from the request
    const { username, password } = req.body;

    // Call to the function that verifies the credentials in the database.
    getUserByUsernameAndPassword(username, password, (err, user) => {
        if (err) { res.status(500).send("Error retrieving user."); } 
        else if (user.length === 0) { res.status(401).send("Invalid username or password."); } 
        else { res.status(200).json({ username: user[0].Username, isHost: user[0].IsHost }); }
    });
});

// Registration API
app.post('/api/register', (req, res) => {
    const { firstName, lastName, dob, phoneNumber, address, mail, username, password, isHost } = req.body;

    if (!mail || !username || !password) { res.status(400).send("Mail, username, and password are required."); return; }

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

            connection.query(insertQuery, [firstName, lastName, dob, phoneNumber, address, mail, username, password, isHost],
                (insertErr, insertResults) => {
                    if (insertErr) { console.error("Error registering user:", insertErr.message); res.status(500).send("Error registering user.");} 
                    else { res.status(200).send("User registered successfully!"); }

                    connection.end();
                }
            );
        }
    });
});

// API to get data from homepage presentation houses
app.get('/api/houses', (req, res) => {
    const connection = createConnection();
    const query = `
        SELECT 
            p.PropertyID AS id,
            p.Name AS name,
            CONCAT(u.FirstName, ' ', u.LastName) AS hostName,
            l.City AS city,
            l.State AS state,
            a.PricePerNight AS pricePerNight,
            a.StartDate AS startDate,
            a.EndDate AS endDate,
            GROUP_CONCAT(i.Image SEPARATOR ',') AS images
        FROM properties p
        JOIN users u ON p.UserID = u.UserID
        JOIN locations l ON p.LocationID = l.LocationID
        JOIN (
            SELECT 
                PropertyID,
                PricePerNight,
                StartDate,
                EndDate
            FROM availabilities
            WHERE StartDate >= CURDATE()
            ORDER BY StartDate ASC
        ) a ON p.PropertyID = a.PropertyID
        LEFT JOIN images i ON p.PropertyID = i.PropertyID
        GROUP BY p.PropertyID
        HAVING images IS NOT NULL AND images != ''
        LIMIT 100;
    `;

    connection.query(query, (err, results) => {
        if (err) { console.error("Error fetching properties:", err.message); res.status(500).send("Error fetching properties."); }
        else {
            // Parse images into arrays
            const formattedResults = results.map(house => ({ ...house,
                images: house.images ? house.images.split(',') : [], // Split images into an array
            }));
            res.status(200).json(formattedResults);
        }

        connection.end();
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
