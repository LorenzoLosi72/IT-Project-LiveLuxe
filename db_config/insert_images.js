/*
questo file popola la tabella images con degli esempi 
*/


// dati delle immagini
// NB il valore del campo Image e' il suo persorso relativo rispetto a questo file, se cambi la posizione 
// delle immagini o di questo file il percorso potrebbe cambiare
const images = [
    { ImageID: 1, Image: 'properties_images/property_1_pic_1.png', Description: 'Sala accogliente con divano', PropertyID: 1 },
    { ImageID: 2, Image: 'properties_images/property_1_pic_2.png', Description: 'Soggiorno spazioso', PropertyID: 1 },
    { ImageID: 3, Image: 'properties_images/property_1_pic_3.png', Description: 'Camera matrimoniale', PropertyID: 1 },
    { ImageID: 4, Image: 'properties_images/property_1_pic_4.png', Description: 'Seconda camera', PropertyID: 1 },
    { ImageID: 5, Image: 'properties_images/property_1_pic_5.png', Description: 'Bagno con lavatrice', PropertyID: 1 },
    { ImageID: 6, Image: 'properties_images/property_2_pic_1.png', Description: 'Esterno della villa', PropertyID: 2 },
    { ImageID: 7, Image: 'properties_images/property_2_pic_2.png', Description: 'Vista sul paesaggio', PropertyID: 2 },
    { ImageID: 8, Image: 'properties_images/property_2_pic_3.png', Description: 'Piscina privata', PropertyID: 2 },
    { ImageID: 9, Image: 'properties_images/property_2_pic_4.png', Description: 'Terrazza con vista', PropertyID: 2 },
    { ImageID: 10, Image: 'properties_images/property_3_pic_1.png', Description: 'Monolocale luminoso', PropertyID: 3 },
    { ImageID: 11, Image: 'properties_images/property_3_pic_2.png', Description: 'Camera moderna', PropertyID: 3 },
    { ImageID: 12, Image: 'properties_images/property_3_pic_3.png', Description: 'TV e area relax', PropertyID: 3 },
    { ImageID: 13, Image: 'properties_images/property_4_pic_1.png', Description: 'Cucina rustica', PropertyID: 4 },
    { ImageID: 14, Image: 'properties_images/property_4_pic_2.png', Description: 'Soggiorno accogliente', PropertyID: 4 },
    { ImageID: 15, Image: 'properties_images/property_4_pic_3.png', Description: 'Bagno moderno', PropertyID: 4 }
];

// Funzione per inserire le immagini nel database
function insertImages(connection) {
    images.forEach(image => {
        const sql = `INSERT INTO images (ImageID, Image, Description, PropertyID) VALUES (?, ?, ?, ?)`;
        const values = [
            image.ImageID,
            image.Image,
            image.Description,
            image.PropertyID
        ];

        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error('Errore nell\'inserimento dell\'immagine:', error);
            } else {
                console.log('Immagine inserita con ID:', image.ImageID);
            }
        });
    });
}

module.exports = { insertImages };
