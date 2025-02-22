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
        else { res.status(200).json({ username: user[0].Username, isHost: user[0].IsHost, firstName: user[0].FirstName, lastName: user[0].LastName, userId: user[0].UserID })}
    });
});

app.get('/api/host-bookings/:userID', (req, res) => {
    const { userID } = req.params;

    if (!userID) {
        return res.status(400).json({ success: false, message: 'UserID is required' });
    }

    const connection = createConnection();
    const query = `
        SELECT b.BookingID, b.StartDate, b.EndDate, b.TotalPrice, b.BookingStatus,
               p.Name AS PropertyName, u.username AS GuestName
        FROM bookings b
        JOIN properties p ON b.PropertyID = p.PropertyID
        JOIN users u ON b.UserID = u.UserID
        WHERE p.UserID = ?;
    `;

    connection.query(query, [userID], (err, results) => {
        if (err) {
            console.error('Error fetching host bookings:', err);
            connection.end();
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            connection.end();
            return res.status(404).json({ success: false, message: 'No bookings found for your properties' });
        }

        res.status(200).json(results);
        connection.end();
    });
});

// User account data API
app.post('/api/user-data', (req, res) => {
    const { userId } = req.body;  

    if (!userId) { return res.status(400).json({ success: false, message: 'UserId is required' }); }

    const connection = createConnection();
    const query = `SELECT UserID, FirstName, LastName, DoB, TelephoneNumber, Address, Mail, Username, IsHost FROM users WHERE UserID = ?`;  

    connection.query(query, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching user data:', err);
            connection.end();
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (result.length === 0) {
            connection.end();
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json(result[0]);
        connection.end();
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

app.post("/api/booking", (req, res) => {
    const { startDate, endDate, houseId, totalPrice, username } = req.body;

    if (!startDate || !endDate || !houseId || !username) {
        return res.status(400).json({
            success: false,
            message: 'Missing startDate, endDate, houseId, or username'
        });
    }

    console.log(`Dati ricevuti: Start Date = ${startDate}, End Date = ${endDate}, House ID = ${houseId}, Username = ${username} \n`);
    const connection = createConnection();

    // Trova lo userId basato sullo username
    const getUserQuery = "SELECT UserID FROM users WHERE Username = ?";
    
    connection.query(getUserQuery, [username], (err, results) => {
        if (err) {
            console.error("Errore nel recupero dello UserID:", err);
            connection.end();
            return res.status(500).json({ success: false, message: 'Errore nel recupero dello UserID' });
        }

        if (results.length === 0) {
            console.log("Nessun utente trovato con questo username.");
            connection.end();
            return res.status(404).json({ success: false, message: 'Utente non trovato' });
        }

        const userId = results[0].UserID;
        console.log(`UserID trovato: ${userId}`);

        // Ora che abbiamo lo userId, continuiamo con la prenotazione
        const mStartDate = new Date(startDate);
        mStartDate.setDate(mStartDate.getDate() + 1);
        const bookingStartDate = mStartDate.toISOString().split('T')[0];

        const mEndDate = new Date(endDate);
        const bookingEndDate = mEndDate.toISOString().split('T')[0];

        const nextDay = new Date(bookingEndDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayFormatted = nextDay.toISOString().split('T')[0];

        console.log(`Date convertite: Start Date = ${bookingStartDate}, End Date = ${bookingEndDate}`);

        const checkAvailabilityQuery = `
            SELECT * FROM availabilities
            WHERE PropertyID = ? AND StartDate <= ? AND EndDate >= ?`;

        connection.query(checkAvailabilityQuery, [houseId, bookingStartDate, bookingEndDate], (err, rows) => {
            if (err) {
                console.error("Errore durante il controllo della disponibilità:", err);
                connection.end();
                return res.status(500).json({ success: false, message: 'Errore nel controllo della disponibilità' });
            }

            if (rows.length === 0) {
                console.log("Nessuna disponibilità trovata per le date selezionate.");
                connection.end();
                return res.status(404).json({ success: false, message: 'Nessuna disponibilità trovata' });
            }

            const availability = rows[0];
            let startDate = new Date(availability.StartDate);
            let endDate = new Date(availability.EndDate);
            startDate.setDate(startDate.getDate() + 1);
            endDate.setDate(endDate.getDate() + 1);

            const StartDate = startDate.toISOString().split('T')[0];
            const EndDate = endDate.toISOString().split('T')[0];

            console.log(`Disponibilità trovata: Start Date = ${StartDate}, End Date = ${EndDate}`);

            const deleteQuery = "DELETE FROM availabilities WHERE PropertyID = ? AND StartDate = ? AND EndDate = ?";
            connection.query(deleteQuery, [houseId, availability.StartDate, availability.EndDate], (err) => {
                if (err) {
                    console.error("Errore durante l'eliminazione della disponibilità:", err);
                    connection.end();
                    return res.status(500).json({ success: false, message: 'Errore durante l\'eliminazione della disponibilità' });
                }

                console.log(`Disponibilità eliminata: Start Date = ${StartDate}, End Date = ${EndDate}`);

                const bookingStatus = 'Confirmed';

                const insertBookingQuery = `
                    INSERT INTO bookings (StartDate, EndDate, TotalPrice, BookingStatus, PropertyID, UserID) 
                    VALUES (?, ?, ?, ?, ?, ?)`;

                connection.query(insertBookingQuery, [bookingStartDate, nextDayFormatted, totalPrice, bookingStatus, houseId, userId], (err) => {
                    if (err) {
                        console.error("Errore durante l'inserimento della prenotazione:", err);
                        connection.end();
                        return res.status(500).json({ success: false, message: 'Errore durante l\'inserimento della prenotazione' });
                    }

                    console.log(`Prenotazione inserita: Start Date = ${bookingStartDate}, End Date = ${bookingEndDate}`);

                    const pricePerNight = availability.PricePerNight;
                    let queries = [];

                    if (bookingStartDate > StartDate) {
                        let parsedBookingStartDate = new Date(mStartDate);
                        parsedBookingStartDate.setDate(parsedBookingStartDate.getDate());
                        let formattedBookingStartDate = parsedBookingStartDate.toISOString().split('T')[0];

                        queries.push({
                            query: "INSERT INTO availabilities (StartDate, EndDate, PropertyID, PricePerNight) VALUES (?, ?, ?, ?)",
                            params: [StartDate, formattedBookingStartDate, houseId, pricePerNight]
                        });
                        console.log(`Nuova disponibilità prima: Start Date = ${StartDate}, End Date = ${formattedBookingStartDate}`);
                    }

                    if (bookingEndDate < EndDate) {
                        let parsedBookingEndDate = new Date(mEndDate);
                        parsedBookingEndDate.setDate(parsedBookingEndDate.getDate() + 1);
                        let formattedBookingEndDate = parsedBookingEndDate.toISOString().split('T')[0];

                        if (formattedBookingEndDate !== EndDate) {
                            queries.push({
                                query: "INSERT INTO availabilities (StartDate, EndDate, PropertyID, PricePerNight) VALUES (?, ?, ?, ?)",
                                params: [formattedBookingEndDate, EndDate, houseId, pricePerNight]
                            });
                            console.log(`Nuova disponibilità dopo: Start Date = ${formattedBookingEndDate}, End Date = ${EndDate}`);
                        }
                    }

                    function executeNextQuery() {
                        if (queries.length === 0) {
                            console.log("Prenotazione confermata e disponibilità aggiornata.");
                            connection.end();
                            return res.status(200).json({ success: true, message: 'Prenotazione confermata e disponibilità aggiornata' });
                        }
                        const { query, params } = queries.shift();
                        connection.query(query, params, (err) => {
                            if (err) {
                                console.error("Errore durante l'aggiornamento della disponibilità:", err);
                                connection.end();
                                return res.status(500).json({ success: false, message: 'Errore durante l\'aggiornamento della disponibilità' });
                            }

                            console.log(`Disponibilità inserita: Start Date = ${params[0]}, End Date = ${params[1]}`);
                            executeNextQuery();
                        });
                    }

                    executeNextQuery();
                });
            });
        });
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

// Booking confirm API
app.post('/api/bookings', (req, res) => {
    const { startDate, endDate, totalPrice, bookingStatus, propertyId, userId } = req.body;

    if (!startDate || !endDate || !totalPrice || !propertyId || !userId) { return res.status(400).send("Missing required booking details."); }

    const connection = createConnection();

    const insertBookingQuery = `
        INSERT INTO bookings (StartDate, EndDate, TotalPrice, BookingStatus, PropertyID, UserID)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    connection.query(insertBookingQuery, [startDate, endDate, totalPrice, bookingStatus, propertyId, userId], (err, results) => {
        if (err) {
            console.error("Error creating booking:", err.message);
            res.status(500).send("Error creating booking.");
            connection.end();
        } else {
            const bookingId = results.insertId;  
            res.status(201).json({ bookingId });  
            connection.end();
        }
    });
});

// Payment booking API
app.post('/api/payments', (req, res) => {
    const { paymentDate, amount, bookingId } = req.body;

    if (!paymentDate || !amount || !bookingId) { return res.status(400).send("Missing required payment details."); }

    const connection = createConnection();

    const insertPaymentQuery = `
        INSERT INTO payments (PaymentDate, Amount, BookingID)
        VALUES (?, ?, ?)
    `;
    
    connection.query(insertPaymentQuery, [paymentDate, amount, bookingId], (err, results) => {
        if (err) {
            console.error("Error processing payment:", err.message);
            res.status(500).send("Error processing payment.");
            connection.end();
        } else {
            res.status(201).json({ message: 'Payment processed successfully' });
            connection.end();
        }
    });
});

// Update Booking Status API
app.post('/api/update-booking-status', (req, res) => {
    const { bookingId } = req.body;
    console.log("Update APi entering")

    if (!bookingId) { return res.status(400).send("Booking ID is required."); }

    const connection = createConnection();

    const updateBookingQuery = `
        UPDATE bookings 
        SET BookingStatus = 'Deleted' 
        WHERE BookingID = ?
    `;

    connection.query(updateBookingQuery, [bookingId], (err, results) => {
        if (err) {
            console.error("Error updating booking status:", err.message);
            res.status(500).send("Error updating booking status.");
        } else {
            res.status(200).json({ message: 'Booking status updated to Deleted.' });
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

app.get('/api/house/:id/availability', (req, res) => {
    const connection = createConnection(); // Crea la connessione al database
    const houseId = parseInt(req.params.id, 10); // Ottieni l'ID dalla URL

    // Stampa un messaggio per confermare che la richiesta è stata ricevuta
    console.log(`We are in house ${houseId}`);

    const query = 'SELECT StartDate, EndDate FROM availabilities WHERE PropertyID = ?';

    connection.query(query, [houseId], (err, results) => {
        if (err) {
            // In caso di errore, stampa l'errore e restituisci una risposta 500
            console.error('Errore durante l\'esecuzione della query:', err);
            return res.status(500).json({ message: 'Errore del server.' });
        }

        // Risposta vuota se non ci sono disponibilità
        if (results.length === 0) {
            return res.status(404).json({ message: 'Nessuna disponibilità trovata per questa casa.' });
        }

        // Se i dati sono stati trovati, invia i risultati
        res.json(results);
    });

    // Chiudi la connessione solo dopo aver completato la query
    connection.end();
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
