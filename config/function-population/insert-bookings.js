// Import resetAutoincrement function
let { resetAutoIncrement } = require('./reset-autoincrement.js');

// List of booking records
const bookings = [
    { StartDate: '2023-05-01', EndDate: '2023-05-07', TotalPrice: 700.0, BookingStatus: 'Confirmed', PropertyID: 1, UserID: 2 },
    { StartDate: '2023-05-10', EndDate: '2023-05-15', TotalPrice: 600.0, BookingStatus: 'Pending', PropertyID: 2, UserID: 4 },
    { StartDate: '2023-06-01', EndDate: '2023-06-05', TotalPrice: 500.0, BookingStatus: 'Confirmed', PropertyID: 3, UserID: 2 },
    { StartDate: '2023-07-01', EndDate: '2023-07-10', TotalPrice: 1000.0, BookingStatus: 'Deleted', PropertyID: 4, UserID: 4 }
];

// Function for populate bookings table
function insertBookings(connection) {
    resetAutoIncrement(connection, 'bookings');

    bookings.forEach(booking => {
        const sql = `INSERT INTO bookings (StartDate, EndDate, TotalPrice, BookingStatus, PropertyID, UserID) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [booking.StartDate, booking.EndDate, booking.TotalPrice, booking.BookingStatus, booking.PropertyID, booking.UserID];

        connection.query(sql, values, (error, results) => {
            if (error) { console.error('Error inserting a record into bookings table: ', error); } else { console.log('Record inserted into bookings table successfully.'); }
        });
    });
}

module.exports = { insertBookings };