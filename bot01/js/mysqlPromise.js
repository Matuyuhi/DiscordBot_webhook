const beginTransaction = (connection) => {
    return new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

const query = (connection, statement, params) => {
    return new Promise((resolve, reject) => {
        connection.query(statement, params, (err, results, fields) => {
            if (err) {
                reject(err)
            } else {
                resolve(results, fields)
            }
        })
    })
}

const commit = (connection) => {
    return new Promise((resolve, reject) => {
        connection.commit((err) => {
            if (err) {
                reject(err)
            } else {
                resolve(err)
            }
        })
    })
}

const rollback = (connection, err) => {
    return new Promise((resolve, reject) => {
        connection.rollback(() => {
            reject(err)
        })
    })
}

module.exports = {
    beginTransaction: beginTransaction,
    query: query,
    commit: commit,
    rollback: rollback,
}

// app.get('/users', async (req, res, next) => {
//     try {
//         await mysqlPromise.beginTransaction(connection);
//         const results = await mysqlPromise.query(connection, 'INSERT INTO posts (content) VALUES (?)', ['Hello!']);
//         var log = 'Post ' + results.insertId + ' added';
//         await mysqlPromise.query(connection, 'INSERT INTO logs (message) VALUES (?)', log);
//         await mysqlPromise.commit(connection);
//     } catch (err) {
//         await mysqlPromise.rollback(connection, err);
//     } finally {
//         connection.end();
//     }
// })().catch((err) => {
//     console.error(err);
// });
