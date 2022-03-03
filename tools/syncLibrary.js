const getDoc = require('../lib/gdoc').getDoc

// https://theoephraim.github.io/node-google-spreadsheet/
const fs = require('fs')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const dotenv = require('dotenv')
dotenv.config()

const fileID = process.env.LIB_FILE_ID
const doc = new GoogleSpreadsheet(fileID)
doc.useApiKey(process.env.GOOGLE_SHEET_API_KEY)

function ok(str) {
  return str !== null && str !== undefined && str.trim().length > 0
}

const defaultCover = '/images/covers/0-h.png'

function makeLangFile(rows, locale) {
  return [
    '/* eslint-disable quote-props */',
    'export default {',
    ...rows.map((row, i) => '  ' + `'${row.id}': '${row[locale]}'` + (i < rows.length - 1 ? ',' : '')),
    '}',
    ''
  ].join('\n')
}

async function getRedirects(rows) {
  result = rows.filter(row => row.from && row.to).map(row => ({
    active: row.active ? true : false,
    from: row.from,
    to: row.to,
    ...(ok(row.type) ? { type: row.type } : {}),
    ...(ok(row.title) ? { title: row.title } : {}),
    ...(ok(row.publishedAt) ? { publishedAt: row.publishedAt } : {}),
    ...(ok(row.updatedAt) ? { updatedAt: row.updatedAt } : {})
  }))
  fs.writeFileSync('data/redirects.json', JSON.stringify(result))
}

async function getTree(rows) {
  const tree = rows.filter(row => row.id && row.group && row.level).map(row => ({
    id: row.id,
    group: +row.group,
    level: +row.level,
    ...(ok(row.parent) ? { parent: row.parent } : {}),
    ...(ok(row.code) ? { code: row.code } : {}),
    image: row.image ? row.image : defaultCover,
    ...(ok(row.path) ? { path: row.path } : {})
  }))
  const locale_tw = Object.assign({}, ...rows.filter(row => row.id && row._tw).map(row => ({ [row.id]: row._tw })))
  const locale_en = Object.assign({}, ...rows.filter(row => row.id && row._en).map(row => ({ [row.id]: row._en })))

  fs.writeFileSync('data/tree.json', JSON.stringify(tree, null, '\t'))
  fs.writeFileSync('locales/tw.json', JSON.stringify(locale_tw, null, '\t'))
  fs.writeFileSync('locales/en.json', JSON.stringify(locale_en, null, '\t'))
}

async function getArticles(rows) {
  rows = rows.filter(row => row.id && row.publicURL_tw).map(row => ({
    show: row.show ? true : false,
    type: row.type,
    id: row.id,
    publicURLs: {
      _tw: row.publicURL_tw,
      ...(ok(row.publicURL_en) ? { _en: row.publicURL_en } : {})
    },
    publishedAt: row.publishedAt,
    ...(row.updatedAt ? { updatedAt: row.updatedAt } : {}),
    ...(row.path ? { path: row.path } : {}),
    cache: row.cache ? true : false,
    localizedDocs: {}
  }))

  // id -> path = idMap
  // path -> id = pathMap
  const idMap = {}
  const pathMap = {}
  rows.forEach(row => {
    let path = row.path
    if(path !== undefined) {
      pathMap[path] = row.id
    }
    if(['article', 'video'].includes(row.type) && row.show === true) {
      path = '/a/' + row.id
    }
    if(path !== undefined) {
      idMap[row.id] = path
    }
  })
  fs.writeFileSync('data/paths.json', JSON.stringify(pathMap, null, '\t'))
  console.info('paths.json updated')

  // update tree
  const tree = JSON.parse(fs.readFileSync('data/tree.json', 'utf8'))
  for(let i = 0; i < tree.length; i++) {
    let node = tree[i]
    if(node.path === undefined && idMap[node.id] !== undefined) {
      node.path = idMap[node.id]
    }
  }
  fs.writeFileSync('data/tree.json', JSON.stringify(tree, null, '\t'))
  console.info('tree.json updated')

  // get article metadata
  for(let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const locales = Object.keys(row.publicURLs)
    console.info(row.id, locales)
    let localizedDocs = await Promise.all(locales.map(locale => getDoc(row.publicURLs[locale], locale)))

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
        doc.cache = row.id + locale
      }
      doc.locale = locale
      delete doc.coverImageDescHTML
      delete doc.authorInfoItemsHTML
      delete doc.summaryHTML
      delete doc.html
      row.localizedDocs[locale] = doc
    })
  }
  const result = Object.assign({}, ...rows.map(row => ({ [row.id]: row })))
  fs.writeFileSync('data/articles.json', JSON.stringify(result, null, '\t'))
  console.info('articles.json updated')
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

  const confs = rows.filter(row => row.type === 'conf' && row.id && row.publicURL_tw).map(row => ({
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
    let localizedDocs = await Promise.all(locales.map(locale => getDoc(conf.publicURLs[locale], locale)))

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
  fs.writeFileSync('data/confs.json', JSON.stringify(confs, null, '\t'))
  // FIXME: this preserves order (js sort numeric keys) but make /e/_id slower
}

async function get() {
  await doc.loadInfo()
  const sheetIDs = [
    process.env.LIB_REDIRECTS,
    process.env.LIB_TREE,
    process.env.LIB_ARTICLES,
    process.env.LIB_EVENTS
  ]
  console.info('requesting data...')
  const sheets = await Promise.all(sheetIDs.map(s => doc.sheetsById[s].getRows()))
  let rows, result

  console.info(shouldGetRedirects ? 'redirects...' : 'skip redirects')
  if(shouldGetRedirects) {
    await getRedirects(sheets[0])
  }
  console.info(shouldGetTree ? 'tree...' : 'skip tree')
  if(shouldGetTree) {
    await getTree(sheets[1])
  }
  console.info(shouldGetArticles ? 'articles...' : 'skip articles')
  if(shouldGetArticles) {
    await getArticles(sheets[2])
  }
  console.info(shouldGetEvents ? 'events...' : 'skip events')
  if(shouldGetEvents) {
    await getEvents(sheets[3])
  }
}

const shouldGetRedirects = true
const shouldGetTree = true
const shouldGetArticles = true
const shouldGetEvents = true
get()