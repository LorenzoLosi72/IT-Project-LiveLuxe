/*
questo file popola la tabella reviews con degli esempi 
*/
const reviews = [
    { ReviewID: 1, TextReview: "Appartamento pulito e ben organizzato, situato in una posizione ideale.", Rating: 5, DateReview: '2023-05-15', PropertyID: 1, UserID: 2 },
    { ReviewID: 2, TextReview: "Una villa stupenda con tutti i comfort, perfetta per una vacanza rilassante.", Rating: 5, DateReview: '2023-05-16', PropertyID: 2, UserID: 4 },
    { ReviewID: 3, TextReview: "Monolocale perfetto per un weekend, moderno e pulito.", Rating: 5, DateReview: '2023-06-09', PropertyID: 3, UserID: 2 },
    { ReviewID: 4, TextReview: "Casa accogliente con una vista incredibile, perfetta per una pausa in montagna peccato per i vicini chiassosi", Rating: 5, DateReview: '2023-07-13', PropertyID: 4, UserID: 4 },
];

// Funzione per inserire le recensioni nel database
function insertReviews(connection) {
    reviews.forEach(review => {
        const sql = `INSERT INTO reviews (ReviewID, TextReview, Rating, DateReview, PropertyID, UserID) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [
            review.ReviewID,
            review.TextReview,
            review.Rating,
            review.DateReview,
            review.PropertyID,
            review.UserID
        ];

        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error('Errore nell\'inserimento della recensione:', error);
            } else {
                console.log('Recensione inserita con ID:', review.ReviewID);
            }
        });
    });
}

module.exports = { insertReviews };
