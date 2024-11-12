/*
File per l'inserimento degli utenti, le password vengono criptate con sha 256
Per comodita' gli utenti con id pari sono clienti, quelli con id dispari sono host
*/


const crypto = require('crypto');

// Funzione per criptare la password con SHA-256
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}
// User inseriti
const users = [
    { UserID: 1, FirstName: 'Luca', LastName: 'Rossi', DoB: '1990-01-01', TelephoneNumber: '3281234567', Address: 'Via Roma 10, Milano', Mail: 'lucarossi@gmail.com', Username: 'lucarossi', Password: hashPassword('password123'), IsHost: 1 },
    { UserID: 2, FirstName: 'Giulia', LastName: 'Bianchi', DoB: '1992-02-02', TelephoneNumber: '3292345678', Address: 'Corso Italia 22, Roma', Mail: 'giuliabianchi@gmail.com', Username: 'giuliabianchi', Password: hashPassword('password456'), IsHost: 0 },
    { UserID: 3, FirstName: 'Marco', LastName: 'Verdi', DoB: '1995-03-03', TelephoneNumber: '3273456789', Address: 'Piazza Garibaldi 15, Napoli', Mail: 'marcoverdi@gmail.com', Username: 'marcoverdi', Password: hashPassword('password789'), IsHost: 1 },
    { UserID: 4, FirstName: 'Sara', LastName: 'Conti', DoB: '1998-04-04', TelephoneNumber: '3204567890', Address: 'Via Dante 5, Firenze', Mail: 'saraconti@gmail.com', Username: 'saraconti', Password: hashPassword('password1011'), IsHost: 0 }
];

// Funzione per inserire gli utenti nel database
function insertUsers(connection) {
    users.forEach(user => {
        const sql = `INSERT INTO users (UserID, FirstName, LastName, DoB, TelephoneNumber, Address, Mail, Username, Password, IsHost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [user.UserID, user.FirstName, user.LastName, user.DoB, user.TelephoneNumber, user.Address, user.Mail, user.Username, user.Password, user.IsHost];

        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error('Errore nell\'inserimento dell\'utente:', error);
            } else {
                console.log('Utente inserito con ID:', user.UserID);
            }
        });
    });
}

module.exports = { insertUsers };

