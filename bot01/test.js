const mysql = require('mysql2')
const { getLink } = require('./js/botFunc')

async function main() {
    try {
        const links = await getLink()
        let data = "@Matuyuhi's New comments\nhello\nAssignes.\nMatuyuhi."
        console.log(data)
        data = data.replaceUsersLink(links)
        console.log(data)
    } catch (err) {
        console.log(err)
    }
}

/**
 * @param {[{name: String, id: String, gitname: String}]} replaces
 * @returns String
 */
String.prototype.replaceUsersLink = function (replaces) {
    let out = this
    for (const data of replaces) {
        const base = String(data.gitname)
        const place = '<!@' + String(data.id) + '>'
        if (out.match(base)) {
            out = out.replace(new RegExp(base, 'g'), place)
        }
    }
    return out
}

main()
