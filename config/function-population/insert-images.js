// Import resetAutoincrement function
let { resetAutoIncrement } = require('./reset-autoincrement.js');

// List of image records
const images = [
    { Image: '../../images/properties/property_1_pic_1.png', Description: 'Sala accogliente con divano', PropertyID: 1 },
    { Image: '../../images/properties/property_1_pic_2.png', Description: 'Soggiorno spazioso', PropertyID: 1 },
    { Image: '../../images/properties/property_1_pic_3.png', Description: 'Camera matrimoniale', PropertyID: 1 },
    { Image: '../../images/properties/property_1_pic_4.png', Description: 'Seconda camera', PropertyID: 1 },
    { Image: '../../images/properties/property_1_pic_5.png', Description: 'Bagno con lavatrice', PropertyID: 1 },
    { Image: '../../images/properties/property_2_pic_1.png', Description: 'Esterno della villa', PropertyID: 2 },
    { Image: '../../images/properties/property_2_pic_2.png', Description: 'Vista sul paesaggio', PropertyID: 2 },
    { Image: '../../images/properties/property_2_pic_3.png', Description: 'Piscina privata', PropertyID: 2 },
    { Image: '../../images/properties/property_2_pic_4.png', Description: 'Terrazza con vista', PropertyID: 2 },
    { Image: '../../images/properties/property_3_pic_1.png', Description: 'Monolocale luminoso', PropertyID: 3 },
    { Image: '../../images/properties/property_3_pic_2.png', Description: 'Camera moderna', PropertyID: 3 },
    { Image: '../../images/properties/property_3_pic_3.png', Description: 'TV e area relax', PropertyID: 3 },
    { Image: '../../images/properties/property_4_pic_1.png', Description: 'Cucina rustica', PropertyID: 4 },
    { Image: '../../images/properties/property_4_pic_2.png', Description: 'Soggiorno accogliente', PropertyID: 4 },
    { Image: '../../images/properties/property_4_pic_3.png', Description: 'Bagno moderno', PropertyID: 4 }
];

// Function for populate images table
function insertImages(connection) {
    resetAutoIncrement(connection, 'images');

    images.forEach(image => {
        const sql = `INSERT INTO images (Image, Description, PropertyID) VALUES (?, ?, ?)`;
        const values = [image.Image, image.Description, image.PropertyID];

        connection.query(sql, values, (error, results) => {
            if (error) { console.error('Error inserting a record into images table: ', error); } else { console.log('Record inserted into locations table successfully.'); }
        });
    });
}

module.exports = { insertImages };