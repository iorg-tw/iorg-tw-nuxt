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

function makeLangFile(rows, locale) {
  return [
    'export default {',
    ...rows.map((row, i) => '  ' + `${row.id}: '${row[locale]}'` + (i < rows.length - 1 ? ',' : '')),
    '}',
    ''
  ].join('\n')
}

async function get() {
  await doc.loadInfo()
  const sheetIDs = [
    '14645087', // dict
    '508756665', // research-docs
    '76257499' // research-tree
  ]
  console.info('requesting data...')
  const sheets = await Promise.all(sheetIDs.map(s => doc.sheetsById[s].getRows()))
  let rows, result

  console.info('dict...')
  rows = sheets[0]
  rows = rows.filter(row => row.id && row._tw).map(row => ({
    id: row.id,
    _tw: row._tw,
    _en: ok(row._en) ? row._en : row._tw
  }))

  fs.writeFileSync('locales/tw.js', makeLangFile(rows, '_tw'))
  fs.writeFileSync('locales/en.js', makeLangFile(rows, '_en'))

  console.info('research-docs...')
  rows = sheets[1]
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

  console.info('research-tree...')
  rows = sheets[2]
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