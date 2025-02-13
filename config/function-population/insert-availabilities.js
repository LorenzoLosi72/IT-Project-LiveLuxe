// Import resetAutoincrement function
let { resetAutoIncrement } = require('./reset-autoincrement.js');

// List of availability records
const availabilities = [
    { StartDate: '2025-12-01', EndDate: '2030-12-15', PricePerNight: 100.0, PropertyID: 1 },
    { StartDate: '2025-03-01', EndDate: '2029-03-15', PricePerNight: 200.0, PropertyID: 3 },
    { StartDate: '2025-04-01', EndDate: '2029-04-15', PricePerNight: 180.0, PropertyID: 4 },
    { StartDate: '2025-02-10', EndDate: '2025-02-20', PricePerNight: 120.0, PropertyID: 1 },
    { StartDate: '2025-02-21', EndDate: '2025-02-28', PricePerNight: 130.0, PropertyID: 2 },
    { StartDate: '2025-03-05', EndDate: '2025-03-15', PricePerNight: 140.0, PropertyID: 3 },
    { StartDate: '2025-03-16', EndDate: '2025-03-25', PricePerNight: 160.0, PropertyID: 4 },
    { StartDate: '2025-04-20', EndDate: '2025-04-30', PricePerNight: 170.0, PropertyID: 1 },
    { StartDate: '2025-05-01', EndDate: '2025-05-10', PricePerNight: 190.0, PropertyID: 2 },
    { StartDate: '2025-05-15', EndDate: '2025-05-25', PricePerNight: 210.0, PropertyID: 3 },
    { StartDate: '2025-06-01', EndDate: '2025-06-10', PricePerNight: 220.0, PropertyID: 4 },
    { StartDate: '2025-06-15', EndDate: '2025-06-25', PricePerNight: 230.0, PropertyID: 1 },
    { StartDate: '2025-07-01', EndDate: '2025-07-10', PricePerNight: 240.0, PropertyID: 2 },
    { StartDate: '2025-07-15', EndDate: '2025-07-25', PricePerNight: 250.0, PropertyID: 3 },
    { StartDate: '2025-08-01', EndDate: '2025-08-10', PricePerNight: 260.0, PropertyID: 4 },
    { StartDate: '2025-08-15', EndDate: '2025-08-25', PricePerNight: 270.0, PropertyID: 1 },
    { StartDate: '2025-09-01', EndDate: '2025-09-10', PricePerNight: 280.0, PropertyID: 2 },
    { StartDate: '2025-09-15', EndDate: '2025-09-25', PricePerNight: 290.0, PropertyID: 3 },
    { StartDate: '2025-03-01', EndDate: '2025-10-10', PricePerNight: 300.0, PropertyID: 5 },
    { StartDate: '2025-03-01', EndDate: '2025-10-10', PricePerNight: 300.0, PropertyID: 6 },



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