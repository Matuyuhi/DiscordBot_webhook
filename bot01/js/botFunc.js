// const moment = require('moment')
const mysql = require('mysql2')
const config = require('../config/mysql.config.js')
const mysqlPromise = require('./mysqlPromise.js')

exports.ConnectTest = async function () {
    const connection = mysql.createConnection(config.connect)
    try {
        await mysqlPromise.beginTransaction(connection)
        await mysqlPromise.commit(connection)
    } catch (err) {
        console.error(err)
        if (connection.state !== 'disconnected') {
            await mysqlPromise.rollback(connection)
        }
    } finally {
        connection.end()
    }
}
exports.setLink = async function (_gitname, user) {
    const connection = mysql.createConnection(config.connect)
    try {
        if (_gitname == '' || _gitname == null) return
        if (!user || !user.id || !user.username) return
        await mysqlPromise.beginTransaction(connection)

        const id = String(user.id)
        const name = String(user.username)
        const gitname = String(_gitname)

        const res = await mysqlPromise.query(
            connection,
            'select * from linkList where gitname = ?',
            [gitname]
        )
        console.log(res)
        if (res && res.length == 1) {
            await mysqlPromise.query(
                connection,
                'update linkList set name = ?, id = ? where gitname = ?;',
                [name, id, gitname]
            )
        } else {
            await mysqlPromise.query(
                connection,
                'insert into linkList (name, id, gitname) value(?, ?, ?);',
                [name, id, gitname]
            )
        }
        await mysqlPromise.commit(connection)
        return true
    } catch (err) {
        console.error(err)
        if (connection.state !== 'disconnected') {
            await mysqlPromise.rollback(connection)
        }
    } finally {
        connection.end()
    }
}

exports.getLink = async function () {
    const connection = mysql.createConnection(config.connect)
    try {
        await mysqlPromise.beginTransaction(connection)
        const res = await mysqlPromise.query(
            connection,
            'select * from linkList'
        )
        if (!res || !res[0]) {
            return []
        }
        await mysqlPromise.commit(connection)
        return res
    } catch (err) {
        console.error(err)
        if (connection.state !== 'disconnected') {
            await mysqlPromise.rollback(connection)
        }
    } finally {
        if (connection.state !== 'disconnected') {
            connection.end()
        }
    }
}

/**
 * serverにチャンネルとgitをリンクさせる
 * @param {String} _guildId serverId
 * @param {String} _channelId channelId
 * @param {String} _html_url githubURL
 * @param {String} _name teemName
 * @returns Bool
 */
exports.setChannel = async function (_guildId, _channelId, _html_url, _name) {
    const connection = mysql.createConnection(config.connect)
    try {
        await mysqlPromise.beginTransaction(connection)
        if (!_guildId || !_channelId || !_html_url || !_name) return
        const guildId = String(_guildId)
        const channelId = String(_channelId)
        const html_url = String(_html_url)
        const name = String(_name)

        const res = await mysqlPromise.query(
            connection,
            'select * from serverList where guildId = ?',
            [guildId]
        )
        // console.log(res)
        if (res && res.length == 1) {
            await mysqlPromise.query(
                connection,
                'update serverList set name = ?, channelId = ?, html_url = ? where guildId = ?;',
                [name, channelId, html_url, guildId]
            )
        } else {
            await mysqlPromise.query(
                connection,
                'insert into  serverList (name, channelId, html_url, guildId) value(?, ?, ?, ?);',
                [name, channelId, html_url, guildId]
            )
        }
        await mysqlPromise.commit(connection)
        return true
    } catch (err) {
        console.error(err)
        if (connection.state !== 'disconnected') {
            await mysqlPromise.rollback(connection)
        }
    } finally {
        if (connection.state !== 'disconnected') {
            connection.end()
        }
    }
}

/**
 * 指定したguildId(Server)のチャンネルを取得
 * @param {String} _guildId
 * @returns {name: String, guildId: String, channelId: String, html_url: String}?
 */
exports.getChannel = async function (_guildId) {
    const connection = mysql.createConnection(config.connect)
    try {
        await mysqlPromise.beginTransaction(connection)

        const res = await mysqlPromise.query(
            connection,
            'select * from serverList where guildId = ?',
            [String(_guildId)]
        )
        if (!res || !res[0]) {
            return {}
        }
        await mysqlPromise.commit(connection)
        return res[0]
    } catch (err) {
        console.error(err)
        if (connection.state !== 'disconnected') {
            await mysqlPromise.rollback(connection)
        }
    } finally {
        if (connection.state !== 'disconnected') {
            connection.end()
        }
    }
}
