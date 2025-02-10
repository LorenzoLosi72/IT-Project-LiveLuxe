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

// Search and Advanced search API
app.post('/api/search', (req, res) => {
    const { destination, checkIn, checkOut, guestsNumber, hasKitchen, hasParking, hasAC, hasWiFi, hasPool, bedrooms, budget } = req.body;

    console.log("Received search parameters:", req.body); // Test

    const connection = createConnection();

    // Basic query
    let query = `
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
        JOIN availabilities a ON p.PropertyID = a.PropertyID
        LEFT JOIN images i ON p.PropertyID = i.PropertyID
        WHERE a.StartDate <= ? AND a.EndDate >= ?
          AND (
              l.City LIKE ? OR l.State LIKE ?
          )
          AND p.GuestsNumber >= ?`;

    const params = [checkIn, checkOut, `%${destination}%`,`%${destination}%`, parseInt(guestsNumber)];

    // Adding advanced filters
    if (hasKitchen !== undefined) { query += hasKitchen ? ' AND p.Kitchen = 1' : ' AND p.Kitchen = 0'; }
    if (hasParking !== undefined) { query += hasParking ? ' AND p.Parking = 1' : ' AND p.Parking = 0'; }
    if (hasAC !== undefined) { query += hasAC ? ' AND p.AirConditioning = 1' : ' AND p.AirConditioning = 0'; }
    if (hasWiFi !== undefined) { query += hasWiFi ? ' AND p.WIFI = 1' : ' AND p.WIFI = 0'; }
    if (hasPool !== undefined) { query += hasPool ? ' AND p.Pool = 1' : ' AND p.Pool = 0'; }
    if (bedrooms) { query += ' AND p.Bedrooms >= ?'; params.push(bedrooms); }
    if (budget) { query += ' AND a.PricePerNight <= ?'; params.push(budget); }

    console.log("Final query:", query); // Test
    console.log("Params:", params);     // Test


    connection.query(query, params, (err, results) => {
        if (err) {
            console.error("Error executing search query:", err.message);
            res.status(500).send("Error executing search query.");
        } else {
            const formattedResults = results.map(house => ({
                ...house,
                images: house.images ? house.images.split(',') : [],
            }));
            res.status(200).json(formattedResults);
        }
        connection.end();
    });
});

// House details API
app.get('/api/house/:id', (req, res) => {
    const houseId = req.params.id;

    const connection = createConnection();

    // Function close database connection 
    const closeConnection = () => {
        connection.end((err) => {
            if(err) { console.error("Error closing the connection: ", err.message); }
        });
    }

    // Details House Query
    const houseQuery = `
        SELECT 
            p.PropertyID AS id,
            p.Name AS name,
            p.GuestsNumber AS guestsNumber,
            p.Bedrooms AS bedrooms,
            p.Kitchen AS kitchen,
            p.WIFI AS wifi,
            p.Parking AS parking,
            p.Pool AS pool,
            p.AirConditioning AS airConditioning,
            p.Notes AS notes,
            p.Address AS address,
            l.City AS city,
            l.State AS state,
            CONCAT(u.FirstName, ' ', u.LastName) AS hostName,
            GROUP_CONCAT(i.Image SEPARATOR ',') AS images
        FROM properties p
        JOIN users u ON p.UserID = u.UserID
        JOIN locations l ON p.LocationID = l.LocationID
        LEFT JOIN images i ON p.PropertyID = i.PropertyID
        WHERE p.PropertyID = ?
        GROUP BY p.PropertyID
    `;

    connection.query(houseQuery, [houseId], (err, houseResults) => {
        if (err) { 
            console.error("Error fetching house details:", err.message);
            closeConnection();
            res.status(500).send("Error fetching house details."); 
        }
        else if (houseResults.length === 0) {
                closeConnection(); 
                res.status(404).send("House not found."); 
        }
    
        const houseDetails = houseResults[0];
        houseDetails.images = houseDetails.images ? houseDetails.images.split(',') : [];

        // Reviews House Query
        const reviewQuery = `
                SELECT r.Rating, r.TextReview, DATE_FORMAT(r.DateReview, '%Y-%m-%dT%H:%i:%sZ') AS dateReview, u.Username AS userName 
                FROM reviews r
                JOIN users u ON r.UserID = u.UserID
                WHERE r.PropertyID = ?
                ORDER BY r.DateReview DESC
        `;

        connection.query(reviewQuery, [houseId], (reviewErr, reviews) => {
            if (reviewErr) {
                console.error("Error fetching reviews:", reviewErr.message);
                closeConnection();
                return res.status(500).send("Error fetching reviews.");
            }

            // Availabilities House Query
            const availabilityQuery = `
                SELECT DATE_FORMAT(a.StartDate, '%Y-%m-%dT%H:%i:%s.000Z') AS startDate, DATE_FORMAT(a.EndDate, '%Y-%m-%dT%H:%i:%s.000Z') AS endDate, a.PricePerNight
                FROM availabilities a
                WHERE a.PropertyID = ?
                AND a.StartDate >= CURDATE()
                ORDER BY a.StartDate
            `;

            connection.query(availabilityQuery, [houseId], (availabilityErr, availabilities) => {
                if (availabilityErr) {
                    console.error("Error fetching availabilities:", availabilityErr.message);
                    closeConnection();
                    return res.status(500).send("Error fetching availabilities");
                }


                closeConnection();
                res.status(200).json({...houseDetails, reviews, availabilities });

            });
        });
    });
});

// API per recuperare le date disponibili di una casa
app.get('/api/house/:id/availability', (req, res) => {
    const houseId = req.params.id;

    const connection = createConnection();

    const query = `
        SELECT 
            DATE_FORMAT(StartDate, '%Y-%m-%d') AS startDate, 
            DATE_FORMAT(EndDate, '%Y-%m-%d') AS endDate, 
            UnavailableDates 
        FROM availabilities 
        WHERE PropertyID = ? AND StartDate >= CURDATE()
    `;

    connection.query(query, [houseId], (err, results) => {
        if (err) {
            console.error("Errore durante il recupero delle disponibilità:", err.message);
            res.status(500).send("Errore durante il recupero delle disponibilità.");
            connection.end();
            return;
        }

        if (results.length === 0) {
            res.status(404).send("Disponibilità non trovata per questa casa.");
            connection.end();
            return;
        }

        // Estrarre tutte le date disponibili
        const availability = results.map(({ startDate, endDate, UnavailableDates }) => {
            const unavailableDates = UnavailableDates ? JSON.parse(UnavailableDates) : [];
            const allDates = [];
            let currentDate = new Date(startDate);

            while (currentDate <= new Date(endDate)) {
                const formattedDate = currentDate.toISOString().split('T')[0];
                if (!unavailableDates.includes(formattedDate)) {
                    allDates.push(formattedDate);
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }

            return allDates;
        });

        const flatAvailability = [].concat(...availability);

        res.status(200).json(flatAvailability);
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
