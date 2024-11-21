// Import resetAutoincrement function
let { resetAutoIncrement } = require('./reset-autoincrement.js');

// List of property records
const properties = [{
        Name: 'Appartamento Centrale',
        GuestsNumber: 4,
        Bedrooms: 2,
        Kitchen: 1,
        Parking: 0,
        Pool: 0,
        WIFI: 1,
        AirConditioning: 1,
        Notes: 'Appartamento situato nel centro storico con tutti i comfort.',
        Address: 'Via Roma 15, Milano',
        UserID: 1,
        LocationID: 1,
        CategoryID: 2
    },
    {
        Name: 'Villa con Giardino',
        GuestsNumber: 8,
        Bedrooms: 4,
        Kitchen: 1,
        Parking: 1,
        Pool: 1,
        WIFI: 1,
        AirConditioning: 1,
        Notes: 'Villa spaziosa con ampio giardino e piscina privata.',
        Address: 'Via dei Fiori 20, Firenze',
        UserID: 3,
        LocationID: 2,
        CategoryID: 1
    },
    {
        Name: 'Monolocale Moderno',
        GuestsNumber: 2,
        Bedrooms: 1,
        Kitchen: 1,
        Parking: 0,
        Pool: 0,
        WIFI: 1,
        AirConditioning: 1,
        Notes: 'Moderno monolocale perfetto per giovani coppie.',
        Address: 'Corso Vittorio Emanuele II, Torino',
        UserID: 1,
        LocationID: 3,
        CategoryID: 2
    },
    {
        Name: 'Casa in Montagna',
        GuestsNumber: 5,
        Bedrooms: 3,
        Kitchen: 1,
        Parking: 1,
        Pool: 0,
        WIFI: 0,
        AirConditioning: 0,
        Notes: 'Casa rustica in montagna, ideale per chi cerca tranquillità.',
        Address: 'Località Monte Bianco, Courmayeur',
        UserID: 3,
        LocationID: 4,
        CategoryID: 3
    }
];

// Function for populate properties table
function insertProperties(connection) {
    resetAutoIncrement(connection, 'properties');

    properties.forEach(property => {
        const sql = `INSERT INTO properties (Name, GuestsNumber, Bedrooms, Kitchen, Parking, Pool, WIFI, AirConditioning, Notes, Address, UserID, LocationID, CategoryID) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [property.Name, property.GuestsNumber, property.Bedrooms, property.Kitchen, property.Parking, property.Pool, property.WIFI, property.AirConditioning, property.Notes,
            property.Address, property.UserID, property.LocationID, property.CategoryID
        ];

        connection.query(sql, values, (error, results) => {
            if (error) { console.error('Error inserting a record into properties table:', error); } else { console.log('Record inserted into properties table successfully.'); }
        });
    });
}

module.exports = { insertProperties };