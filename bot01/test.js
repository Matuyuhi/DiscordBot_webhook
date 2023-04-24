function main() {
    let data = "@Matuyuhi's New comments\nhello\nAssignes.\nMatuyuhi."
    console.log(data)
    data = addBlockLine(data)
    console.log(data)
}

/**
 * 文字列の行の先頭に'> 'をつける
 * @param {String} _data
 * @returns String
 */
function addBlockLine(_data) {
    let splits = String(_data).split('\n')
    for (const i in splits) {
        splits[i] = '> ' + splits[i]
    }
    return splits.join('\n')
}

main()
