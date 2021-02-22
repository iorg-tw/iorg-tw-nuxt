const getDoc = require('../lib/gdoc').getDoc

// https://theoephraim.github.io/node-google-spreadsheet/
const fs = require('fs')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const sheetID = process.argv.slice(2)[0]
const dotenv = require('dotenv')
dotenv.config()

const doc = new GoogleSpreadsheet(sheetID)
doc.useApiKey(process.env.GOOGLE_SHEET_API_KEY)

function ok(str) {
  return str !== null && str !== undefined && str.trim().length > 0
}

const defaultCover = '/images/covers/x-h.png'

async function get() {
  await doc.loadInfo()
  let sheet, rows, result

  sheet = doc.sheetsById['508756665'] // research-docs
  rows = await sheet.getRows()
  result = rows.filter(row => row.id && row.publicURL_tw).map(row => ({
    published: row.published ? true : false,
    id: row.id,
    publicURLs: {
      _tw: row.publicURL_tw,
      ...(ok(row.publicURL_en) ? { _en: row.publicURL_en } : {})
    },
    localizedDocs: {}
  }))

  result = Object.assign({}, ...result.map(row => ({ [row.id]: row })))
  fs.writeFileSync('data/research-docs.json', JSON.stringify(result, null, '\t'))

  sheet = doc.sheetsById['76257499'] // research-tree
  rows = await sheet.getRows()
  result = rows.map(row => ({
    id: row.id,
    to: row.to,
    level: +row.level,
    ...(ok(row.parentID) ? { parentID: row.parentID } : {}),
    code: row.code,
    image: row.image ? row.image : defaultCover,
    ...(ok(row.isArticle) ? { isArticle: true } : {})
  }))
  fs.writeFileSync('data/research-tree.json', JSON.stringify(result, null, '\t'))
}

get()