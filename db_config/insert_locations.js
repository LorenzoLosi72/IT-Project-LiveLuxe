/*
questo file popola la tabella locations con degli esempi 
*/
const locations = [
    { LocationID: 1, City: 'Milano', State: 'Lombardia' },
    { LocationID: 2, City: 'Firenze', State: 'Toscana' },
    { LocationID: 3, City: 'Torino', State: 'Piemonte' },
    { LocationID: 4, City: 'Courmayeur', State: 'Valle d\'Aosta' }
];

// Funzione per inserire le località nel database
function insertLocations(connection) {
    locations.forEach(location => {
        const sql = `INSERT INTO locations (LocationID, City, State) VALUES (?, ?, ?)`;
        const values = [location.LocationID, location.City, location.State];

        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error('Errore nell\'inserimento della località:', error);
            } else {
                console.log('Località inserita con ID:', location.LocationID);
            }
        });
    });
}

module.exports = { insertLocations };
