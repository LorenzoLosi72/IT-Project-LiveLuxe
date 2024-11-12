/*
questo file popola la tabella categories con degli esempi 
*/
const categories = [
    { CategoryID: 1, Name: 'Appartamento' },
    { CategoryID: 2, Name: 'Villa' },
    { CategoryID: 3, Name: 'Bilocale' },
    { CategoryID: 4, Name: 'Monolocale' },
    { CategoryID: 5, Name: 'Villa con giardino' },
    { CategoryID: 6, Name: 'Hotel' }

];

// Funzione per inserire le categorie nel database
function insertCategories(connection) {
    categories.forEach(category => {
        const sql = `INSERT INTO categories (CategoryID, Name) VALUES (?, ?)`;
        const values = [category.CategoryID, category.Name];

        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error('Errore nell\'inserimento della categoria:', error);
            } else {
                console.log('Categoria inserita con ID:', category.CategoryID);
            }
        });
    });
}

module.exports = { insertCategories };
