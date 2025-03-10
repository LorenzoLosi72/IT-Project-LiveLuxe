// Import resetAutoincrement function
let { resetAutoIncrement } = require('./reset-autoincrement.js');

// List of payment records
const payments = [
    { Amount: 700.0, BookingID: 1 },
    { Amount: 600.0, BookingID: 2 },
    { Amount: 500.0, BookingID: 3 },
    { Amount: 1000.0, BookingID: 4 }
];

// Function for populate payments table
function insertPayments(connection) {
    payments.forEach(payment => {
        const sql = `INSERT INTO payments (Amount, PaymentDate, BookingID) VALUES (?, CURRENT_TIMESTAMP, ?)`;
        const values = [payment.Amount, payment.PaymentMethod, payment.BookingID];

        connection.query(sql, values, (error, results) => {
            if (error) { console.error('Error inserting a record into payments table: ', error); } else { console.log('Record inserted into payments table successfully.'); }
        });
    });
}

module.exports = { insertPayments };