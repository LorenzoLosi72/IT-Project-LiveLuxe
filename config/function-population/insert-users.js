// Import crypto package
const crypto = require('crypto');

// Import resetAutoIncrement function
let { resetAutoIncrement } = require('./reset-autoincrement.js');

// Function for encrypt password with SHA-256
function hashPassword(password) { return crypto.createHash('sha256').update(password).digest('hex'); }

// List of user records
const users = [
    { FirstName: 'Luca', LastName: 'Rossi', DoB: '1990-01-01', TelephoneNumber: '3281234567', Address: 'Via Roma 10, Milano', Mail: 'lucarossi@gmail.com', Username: 'lucarossi', Password: hashPassword('password123'), IsHost: 1 },
    { FirstName: 'Giulia', LastName: 'Bianchi', DoB: '1992-02-02', TelephoneNumber: '3292345678', Address: 'Corso Italia 22, Roma', Mail: 'giuliabianchi@gmail.com', Username: 'giuliabianchi', Password: hashPassword('password456'), IsHost: 0 },
    { FirstName: 'Marco', LastName: 'Verdi', DoB: '1995-03-03', TelephoneNumber: '3273456789', Address: 'Piazza Garibaldi 15, Napoli', Mail: 'marcoverdi@gmail.com', Username: 'marcoverdi', Password: hashPassword('password789'), IsHost: 1 },
    { FirstName: 'Sara', LastName: 'Conti', DoB: '1998-04-04', TelephoneNumber: '3204567890', Address: 'Via Dante 5, Firenze', Mail: 'saraconti@gmail.com', Username: 'saraconti', Password: hashPassword('password1011'), IsHost: 0 }
];



// Function for populate users table
function insertUsers(connection) {
    resetAutoIncrement(connection, 'users');

    users.forEach(user => {
        const sql = `INSERT INTO users (FirstName, LastName, DoB, TelephoneNumber, Address, Mail, Username, Password, IsHost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [user.FirstName, user.LastName, user.DoB, user.TelephoneNumber, user.Address, user.Mail, user.Username, user.Password, user.IsHost];

        connection.query(sql, values, (error, results) => {
            if (error) { console.error('Error inserting a record into users table: ', error); } else { console.log('Record inserted into users table successfully'); }
        });
    });
}

module.exports = { insertUsers };