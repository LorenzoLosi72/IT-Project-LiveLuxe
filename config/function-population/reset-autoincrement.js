// Function reset ID auto increment
function resetAutoIncrement(connection, tableName) {
    const sql = `ALTER TABLE ${tableName} AUTO_INCREMENT = 1`;

    connection.query(sql, (error, results) => {
        if (error) { console.error(`Error reset ${tableName} ID AUTOINCREMENT: `, error); } else { console.log(`Reset ${tableName} ID AUTOINCREMENT successfully.`); }
    });
}

module.exports = { resetAutoIncrement };