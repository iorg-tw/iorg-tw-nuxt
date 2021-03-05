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

async function getArticles(rows) {
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
    cache: row.cache ? true : false,
    localizedDocs: {}
  }))

  for(let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const locales = Object.keys(row.publicURLs)
    console.info(row.id, locales)
    let localizedDocs = await Promise.all(locales.map(locale => getDoc(row.publicURLs[locale])))

    locales.forEach((locale, i) => {
      const doc = localizedDocs[i]
      doc.articleID = row.id
      doc.publicURL = row.publicURLs[locale]
      if(row.publishedAt) {
        doc.publishedAt = row.publishedAt
      }
      if(row.updatedAt) {
        doc.updatedAt = row.updatedAt
      }
      if(row.cache) {
        console.info(row.id, locale, 'cached')
        fs.writeFileSync('data/cached-articles/' + row.id + locale + '.json' , JSON.stringify(doc, null, '\t'))
      }
      delete doc.coverImageDescHTML
      delete doc.authorInfoItemsHTML
      delete doc.summaryHTML
      delete doc.html
      row.localizedDocs[locale] = doc
    })
  }
  const result = Object.assign({}, ...rows.map(row => ({ [row.id]: row })))
  fs.writeFileSync('data/articles.json', JSON.stringify(result, null, '\t'))
}

async function getEvents(rows) {
  const workshops = rows.filter(row => row.type === 'workshop' && row.area && row.name && row.date).map(row => ({
    show: row.show ? true : false,
    area: row.area.trim(),
    name: row.name.trim(),
    loc: row.loc ? row.loc.trim() : null,
    slogan: row.slogan ? row.slogan.trim(): null,
    year: +row.year,
    date: row.date,
    dow: row.dow,
    time: row.start ? [row.start, ...(row.end ? [row.end] : [])].join('-') : row.time
  }))
  fs.writeFileSync('data/workshops.json', JSON.stringify(workshops, null, '\t'))

  let confs = rows.filter(row => row.id && row.publicURL_tw).map(row => ({
    show: row.show ? true : false,
    id: row.id,
    area: row.area.trim(),
    year: +row.year,
    date: row.date,
    dow: row.dow,
    time: row.start ? [row.start, ...(row.end ? [row.end] : [])].join('-') : row.time,
    publicURLs: {
      _tw: row.publicURL_tw,
      ...(ok(row.publicURL_en) ? { _en: row.publicURL_en } : {})
    },
    localizedDocs: {}
  }))

  for(let i = 0; i < confs.length; i++) {
    const conf = confs[i]
    const locales = Object.keys(conf.publicURLs)
    console.info(conf.id, locales)
    let localizedDocs = await Promise.all(locales.map(locale => getDoc(conf.publicURLs[locale])))

    locales.forEach((locale, i) => {
      let doc = localizedDocs[i]
      doc.publicURL = conf.publicURLs[locale]
      if(conf.publishedAt) {
        doc.publishedAt = conf.publishedAt
      }
      if(conf.updatedAt) {
        doc.updatedAt = conf.updatedAt
      }
      delete doc.coverImageDescHTML
      delete doc.authorInfoItemsHTML
      delete doc.summaryHTML
      delete doc.html
      conf.localizedDocs[locale] = doc
    })
  }
  confs = Object.assign({}, ...confs.map(conf => ({ [conf.id]: conf })))
  fs.writeFileSync('data/confs.json', JSON.stringify(confs, null, '\t'))
}

async function get() {
  await doc.loadInfo()
  const sheetIDs = [
    '14645087', // dict
    '1342082190', // archive
    '76257499', // research-tree
    '508756665', // articles
    '1201737578' // events
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
    ...(ok(row.contentInfo) ? { contentInfo: row.contentInfo } : {}),
    ...(ok(row.platform) ? { platform: row.platform } : {}),
    ...(ok(row.srcURL) ? { srcURL: row.srcURL } : {}),
    ...(ok(row.publishedAt) ? { publishedAt: row.publishedAt } : {}),
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
    ...(ok(row.isResearchArticle) ? { isResearchArticle: true } : {})
  }))
  fs.writeFileSync('data/research-tree.json', JSON.stringify(result, null, '\t'))

  console.info(shouldGetArticles ? 'articles...' : 'skip articles.')
  if(shouldGetArticles) {
    await getArticles(sheets[3])
  }

  console.info(shouldGetEvents ? 'events...' : 'skip events.')
  if(shouldGetEvents) {
    await getEvents(sheets[4])
  }
}

const shouldGetArticles = true
const shouldGetEvents = true
get()