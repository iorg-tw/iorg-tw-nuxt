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

const defaultCover = '/images/covers/0-h.png'

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
    '1342082190', // archive
    '76257499', // research-tree
    '508756665' // articles
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

  console.info('archive...')
  rows = sheets[1]
  rows = rows.filter(row => row.id && row.type).map(row => ({
    id: row.id,
    type: row.type,
    fileName: row.id + '.' + row.type,
    ...(ok(row.quickNote) ? { quickNote: row.quickNote } : {}),
    ...(ok(row.data) ? { data: row.data } : {})
  }))
  result = Object.assign({}, ...rows.map(row => ({ [row.id]: row })))
  fs.writeFileSync('data/archive.json', JSON.stringify(result, null, '\t'))

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

  if(!getArticles) {
    return
  }

  console.info('articles...')
  rows = sheets[3]
  rows = rows.filter(row => row.id && row.publicURL_tw).map(row => ({
    published: row.published ? true : false,
    type: row.type,
    id: row.id,
    publicURLs: {
      _tw: row.publicURL_tw,
      ...(ok(row.publicURL_en) ? { _en: row.publicURL_en } : {})
    },
    publishedAt: row.publishedAt,
    ...(row.updatedAt ? { updatedAt: row.updatedAt } : {}),
    localizedDocs: {}
  }))

  for(const row of rows) {
    const locales = Object.keys(row.publicURLs)
    console.info(row.id, locales)
    let localizedDocs = await Promise.all(locales.map(locale => getDoc(row.publicURLs[locale])))

    locales.forEach((locale, i) => {
      let doc = localizedDocs[i]
      doc.publicURL = row.publicURLs[locale]
      if(row.publishedAt) {
        doc.publishedAt = row.publishedAt
      }
      if(row.updatedAt) {
        doc.updatedAt = row.updatedAt
      }
      delete doc.coverImageDescHTML
      delete doc.authorInfoItemsHTML
      delete doc.summaryHTML
      delete doc.html
      row.localizedDocs[locale] = doc
    })
  }
  result = Object.assign({}, ...rows.map(row => ({ [row.id]: row })))
  fs.writeFileSync('data/articles.json', JSON.stringify(result, null, '\t'))
}

const getArticles = false
get()