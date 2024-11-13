// Import mysql package
let mysql = require('mysql');

// Import database connection function
let { createConnection } = require('./connection-database.js');

// Import data insert functions
let { insertUsers } = require('./function-population/insert-users.js');
let { insertLocations } = require('./function-population/insert-locations.js');
let { insertCategories } = require('./function-population/insert-categories.js');
let { insertProperties } = require('./function-population/insert-properties.js');
let { insertAvailabilities } = require('./function-population/insert-availabilities.js');
let { insertBookings } = require('./function-population/insert-bookings.js');
let { insertPayments } = require('./function-population/insert-payments.js');
let { insertReviews } = require('./function-population/insert-reviews.js');
let { insertImages } = require('./function-population/insert-images.js');

// Connection to database with function
const connection = createConnection();

// function to delete all occurrences in the database
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

// Function for populate database
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

// main function to manage connection and population operations
async function main() {

    await clearTables(connection);

    populateTables(connection);

    connection.end();
}

// function to delete all data from a table
function clearTable(connection, tableName) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM ${tableName}`;
        connection.query(sql, (error, results) => {
            if (error) { reject('Database cleanup error: ', error); } else { resolve('database cleanup completed successfully'); }
        });
    });
}

main();