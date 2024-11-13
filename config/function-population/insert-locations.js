// Import resetAutoincrement function
let { resetAutoIncrement } = require('./reset-autoincrement.js');

// List of location records
const locations = [
    { City: 'Milano', State: 'Lombardia' },
    { City: 'Firenze', State: 'Toscana' },
    { City: 'Torino', State: 'Piemonte' },
    { City: 'Courmayeur', State: 'Valle d\'Aosta' }
];

// Function for populate locations table
function insertLocations(connection) {
    resetAutoIncrement(connection, 'locations');

    locations.forEach(location => {
        const sql = `INSERT INTO locations (City, State) VALUES (?, ?)`;
        const values = [location.City, location.State];

        connection.query(sql, values, (error, results) => {
            if (error) { console.error('Error inserting a record into locations table: ', error); } else { console.log('Record inserted into locations table successfully.'); }
        });
    });
}

module.exports = { insertLocations };