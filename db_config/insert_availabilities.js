/*
questo file popola la tabella availabilities con degli esempi 
*/
const availabilities = [
    { AvailabilityID: 1, StartDate: '2024-12-01', EndDate: '2024-12-15', PricePerNight: 100.0, PropertyID: 1 },
    { AvailabilityID: 2, StartDate: '2024-12-16', EndDate: '2024-12-31', PricePerNight: 120.0, PropertyID: 1 },
    { AvailabilityID: 3, StartDate: '2025-01-01', EndDate: '2025-01-15', PricePerNight: 150.0, PropertyID: 2 },
    { AvailabilityID: 4, StartDate: '2025-02-01', EndDate: '2025-02-15', PricePerNight: 170.0, PropertyID: 2 },
    { AvailabilityID: 5, StartDate: '2025-03-01', EndDate: '2025-03-15', PricePerNight: 200.0, PropertyID: 3 },
    { AvailabilityID: 6, StartDate: '2025-04-01', EndDate: '2025-04-15', PricePerNight: 180.0, PropertyID: 4 }
];

// Funzione per inserire le disponibilità nel database
function insertAvailabilities(connection) {
    availabilities.forEach(availability => {
        const sql = `INSERT INTO availabilities (AvailabilityID, StartDate, EndDate, PricePerNight, PropertyID) VALUES (?, ?, ?, ?, ?)`;
        const values = [
            availability.AvailabilityID,
            availability.StartDate,
            availability.EndDate,
            availability.PricePerNight,
            availability.PropertyID
        ];

        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error('Errore nell\'inserimento della disponibilità:', error);
            } else {
                console.log('Disponibilità inserita con ID:', availability.AvailabilityID);
            }
        });
    });
}

module.exports = { insertAvailabilities };
