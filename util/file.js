// file.js
const util = require('util');
const fs = require('fs');

const writeFilePromise = util.promisify(fs.writeFile);
const readFilePromise = util.promisify(fs.readFile);

const save = async (path, str) => {
  await writeFilePromise(path, str);
};

const read = async path => {
  const fileContents = await readFilePromise(path);
  return JSON.parse(fileContents);
};

module.exports = {
	read: read,
	save: save
}