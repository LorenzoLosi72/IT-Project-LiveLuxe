
const payments = [
    { PaymentID: 1, Amount: 700.0, PaymentMethod: 'Visa', BookingID: 1 }, // corrispondente a TotalPrice in bookings
    { PaymentID: 2, Amount: 600.0, PaymentMethod: 'Mastercard', BookingID: 2 },
    { PaymentID: 3, Amount: 500.0, PaymentMethod: 'American Express', BookingID: 3 },
    { PaymentID: 4, Amount: 1000.0, PaymentMethod: 'PayPal', BookingID: 4 }
];

// Funzione per inserire i pagamenti nel database
function insertPayments(connection) {
    payments.forEach(payment => {
        const sql = `INSERT INTO payments (PaymentID, Amount, PaymentDate, PaymentMethod, BookingID) VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?)`;
        const values = [
            payment.PaymentID,
            payment.Amount,
            payment.PaymentMethod,
            payment.BookingID
        ];

        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error('Errore nell\'inserimento del pagamento:', error);
            } else {
                console.log('Pagamento inserito con ID:', payment.PaymentID);
            }
        });
    });
}

module.exports = { insertPayments };
