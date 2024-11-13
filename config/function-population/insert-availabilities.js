// Import resetAutoincrement function
let { resetAutoIncrement } = require('./reset-autoincrement.js');

// List of availability records
const availabilities = [
    { StartDate: '2024-12-01', EndDate: '2024-12-15', PricePerNight: 100.0, PropertyID: 1 },
    { StartDate: '2024-12-16', EndDate: '2024-12-31', PricePerNight: 120.0, PropertyID: 1 },
    { StartDate: '2025-01-01', EndDate: '2025-01-15', PricePerNight: 150.0, PropertyID: 2 },
    { StartDate: '2025-02-01', EndDate: '2025-02-15', PricePerNight: 170.0, PropertyID: 2 },
    { StartDate: '2025-03-01', EndDate: '2025-03-15', PricePerNight: 200.0, PropertyID: 3 },
    { StartDate: '2025-04-01', EndDate: '2025-04-15', PricePerNight: 180.0, PropertyID: 4 }
];

// Function for populate availabilities table
function insertAvailabilities(connection) {
    resetAutoIncrement(connection, 'availabilities');

    availabilities.forEach(availability => {
        const sql = `INSERT INTO availabilities (StartDate, EndDate, PricePerNight, PropertyID) VALUES (?, ?, ?, ?)`;
        const values = [availability.StartDate, availability.EndDate, availability.PricePerNight, availability.PropertyID];

        connection.query(sql, values, (error, results) => {
            if (error) { console.error('Error inserting a record into availabilities table: ', error); } else { console.log('Record inserted into availabilities table successfully.'); }
        });
    });
}

module.exports = { insertAvailabilities };