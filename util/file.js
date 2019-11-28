// file.js
const util = require("util")
const fs = require("fs")

const writeFilePromise = util.promisify(fs.writeFile)
const readFilePromise = util.promisify(fs.readFile)

const save = async (path, str) => {
    await writeFilePromise(path, str)
}

const read = async path => {
    return await readFilePromise(path)
}

module.exports = {
    read: read,
    save: save
}
