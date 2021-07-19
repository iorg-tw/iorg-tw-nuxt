const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()

const data = JSON.parse(fs.readFileSync(path.resolve(process.env.ARCHIVE_REPO_LOCAL_PATH, 'data', 'archive.json')))
fs.writeFileSync(path.resolve(__dirname, '../data', 'archive.json'), JSON.stringify(data, null, '\t'))