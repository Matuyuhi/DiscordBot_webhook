// const moment = require('moment')
const mysql = require('mysql2')
const config = require('../config/mysql.config.js')
const mysqlPromise = require('./mysqlPromise.js')

exports.URLList = async function () {
    const connection = mysql.createConnection(config.connect)
    try {
        await mysqlPromise.beginTransaction(connection)
    } catch {
        console.log()
    } finally {
        connection.end()
    }
}
