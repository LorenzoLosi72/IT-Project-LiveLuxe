/* 
File per inserire le occorrenze delle prenotazioni, attenzione a non inserire date in cui la casa risulta disponibile
*/
// Dati della prenotazione da inserire
const bookings = [
    { BookingID: 1, StartDate: '2023-05-01', EndDate: '2023-05-07', TotalPrice: 700.0, BookingStatus: 'Confirmed', PropertyID: 1, UserID: 2 },
    { BookingID: 2, StartDate: '2023-05-10', EndDate: '2023-05-15', TotalPrice: 600.0, BookingStatus: 'Pending', PropertyID: 2, UserID: 4 },
    { BookingID: 3, StartDate: '2023-06-01', EndDate: '2023-06-05', TotalPrice: 500.0, BookingStatus: 'Confirmed', PropertyID: 3, UserID: 2},
    { BookingID: 4, StartDate: '2023-07-01', EndDate: '2023-07-10', TotalPrice: 1000.0, BookingStatus: 'Deleted', PropertyID: 4, UserID: 4 }
];

// Funzione per inserire le prenotazioni nel database
function insertBookings(connection) {
    bookings.forEach(booking => {
        const sql = `INSERT INTO bookings (BookingID, StartDate, EndDate, TotalPrice, BookingStatus, PropertyID, UserID) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            booking.BookingID,
            booking.StartDate,
            booking.EndDate,
            booking.TotalPrice,
            booking.BookingStatus,
            booking.PropertyID,
            booking.UserID
        ];

        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error('Errore nell\'inserimento della prenotazione:', error);
            } else {
                console.log('Prenotazione inserita con ID:', booking.BookingID);
            }
        });
    });
}

module.exports = { insertBookings };
