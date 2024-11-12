/*
File per la popolazione del database.
Il db deve essere chiamato liveluxe, prima di eseguire il programma attivare MySQL e Apache.
È necessario importare il db prima di eseguire il file.

ATTENZIONE

ATTENZIONE L'ESECUZIONE DELLA FUNZIONE 'clearTables' CANCELLA IN TOTO IL DATABASE, ESEGUIRE QUESTO CODICE CON MOLTA CURA 

ATTENZIONE

Il file effettua una connessione con il db e LO SVUOTA con la funzione 'clearTables'
poi lo popola con la funzione 'populateTables'  per evitare la duplicazione dei dati.
*/


let mysql = require('mysql');

// Importa le funzioni per l'inserimento dei dati
let { insertUsers } = require('./insert_users');
let { insertLocations } = require('./insert_locations');
let { insertCategories } = require('./insert_categories');
let { insertProperties } = require('./insert_properties');
let { insertAvailabilities } = require('./insert_availabilities');
let { insertBookings } = require('./insert_bookings');
let { insertPayments } = require('./insert_payments');
let { insertReviews } = require('./insert_reviews');
let { insertImages } = require('./insert_images');

// parametri di configurazione del db, se il tuo db ha un altro nome cambia il campo "database"
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'liveluxe'
});

// FUNZIONE PER ELIMINARE TUTTE LE OCCORRENZE DELLE TABELLE
async function clearTables(connection) {
    await clearTable(connection, 'users');
    await clearTable(connection, 'locations');
    await clearTable(connection, 'categories');
    await clearTable(connection, 'properties');
    await clearTable(connection, 'availabilities');
    await clearTable(connection, 'bookings');
    await clearTable(connection, 'payments');
    await clearTable(connection, 'reviews');
    await clearTable(connection, 'images');
}

// Funzione per popolare le tabelle con i dati
function populateTables(connection) {
    insertUsers(connection);
    insertLocations(connection);
    insertCategories(connection);
    insertProperties(connection);
    insertAvailabilities(connection);
    insertBookings(connection);
    insertPayments(connection);
    insertReviews(connection);
    insertImages(connection);
}

// Funzione principale per gestire la connessione e le operazioni
async function main() {
    connection.connect(async function(err) {
        if (err) throw err;
        console.log("Connessione al database MySQL avvenuta con successo.");

        // SVUOTA LE TABELLE
        await clearTables(connection);

        // Popola le tabelle
        populateTables(connection);

        // Chiudi la connessione al database
        connection.end();
    });
}

// Funzione per eliminare tutti i dati da una singola tabella
function clearTable(connection, tableName) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM ??`; 
        connection.query(sql, [tableName], (error, results) => {
            if (error) {
                console.error(`Errore durante la pulizia della tabella ${tableName}:`, error);
                reject(error);
            } else {
                console.log(`Tabella ${tableName} svuotata con successo.`);
                resolve(results);
            }
        });
    });
}


main();
