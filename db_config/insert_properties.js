/*
questo file popola la tabella properties con degli esempi 
*/

//dati
const properties = [
    {
        PropertyID: 1,
        Name: 'Appartamento Centrale',
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
        PropertyID: 2,
        Name: 'Villa con Giardino',
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
        PropertyID: 3,
        Name: 'Monolocale Moderno',
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
        PropertyID: 4,
        Name: 'Casa in Montagna',
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

// Funzione per inserire le proprietà nel database
function insertProperties(connection) {
    properties.forEach(property => {
        const sql = `INSERT INTO properties (PropertyID, Name, Bedrooms, Kitchen, Parking, Pool, WIFI, AirConditioning, Notes, Address, UserID, LocationID, CategoryID) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            property.PropertyID,
            property.Name,
            property.Bedrooms,
            property.Kitchen,
            property.Parking,
            property.Pool,
            property.WIFI,
            property.AirConditioning,
            property.Notes,
            property.Address,
            property.UserID,
            property.LocationID,
            property.CategoryID
        ];

        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error('Errore nell\'inserimento della proprietà:', error);
            } else {
                console.log('Proprietà inserita con ID:', property.PropertyID);
            }
        });
    });
}

module.exports = { insertProperties };
