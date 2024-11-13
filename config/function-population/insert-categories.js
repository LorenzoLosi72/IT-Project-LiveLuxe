// Import resetAutoIncrement function
let { resetAutoIncrement } = require('./reset-autoincrement.js');

// List of category records
const categories = [
    { Name: 'Appartamento' },
    { Name: 'Villa' },
    { Name: 'Bilocale' },
    { Name: 'Monolocale' },
    { Name: 'Villa con giardino' },
    { Name: 'Hotel' }

];

// Function for populate categories table
function insertCategories(connection) {
    resetAutoIncrement(connection, 'categories');

    categories.forEach(category => {
        const sql = `INSERT INTO categories (Name) VALUES (?)`;
        const values = [category.Name];

        connection.query(sql, values, (error, results) => {
            if (error) { console.error('Error inserting a record into categories table: ', error); } else { console.log('Record inserted into properties table successfully.'); }
        });
    });
}

module.exports = { insertCategories };