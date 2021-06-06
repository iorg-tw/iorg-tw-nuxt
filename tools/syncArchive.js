const fs = require('fs')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const dotenv = require('dotenv')
dotenv.config()

function ok(str) {
  return str !== null && str !== undefined && str.trim().length > 0
}

async function get() {
  let result = {}
  let sheetIDs, sheets, rows

  // IORG Archive (to be deprecated)

  console.info('IORG Archive (to be deprecated)...')
  const oldArchiveDoc = new GoogleSpreadsheet(process.env.OLD_ARCHIVE_FILE_ID)
  oldArchiveDoc.useApiKey(process.env.GOOGLE_SHEET_API_KEY)

  await oldArchiveDoc.loadInfo()
  sheetIDs = [
    '1342082190'
  ]
  sheets = await Promise.all(sheetIDs.map(s => oldArchiveDoc.sheetsById[s].getRows()))
  rows = sheets[0]
  rows = rows.filter(row => row.ioid && row.type).map(row => ({
    ioid: row.ioid,
    type: row.type,
    ...(['image', 'video'].includes(row.type) && ok(row.ft) ? { fileName: row.ioid + '.' + row.ft } : {}),
    ...(ok(row.srcURL) ? { srcURL: row.srcURL } : {}),
    ...(ok(row.title) ? { title: row.title } : {}),
    ...(ok(row.publishedAt) ? { publishedAt: row.publishedAt } : {}),
    ...(ok(row.author) ? { author: row.author } : {}),
    ...(ok(row.group) ? { group: row.group } : {}),
    ...(ok(row.platform) ? { platform: row.platform } : {}),
    ...(ok(row.text) ? { text: row.text } : {})
  }))
  result = Object.assign(result, ...rows.map(row => ({ [row.ioid]: row })))

  // Dokidoki Archive

  console.info('Dokidoki Archive...')
  const dkArchiveDoc = new GoogleSpreadsheet(process.env.DK_ARCHIVE_FILE_ID)
  dkArchiveDoc.useApiKey(process.env.GOOGLE_SHEET_API_KEY)

  await dkArchiveDoc.loadInfo()
  sheetIDs = [
    '966156440'
  ]
  sheets = await Promise.all(sheetIDs.map(s => dkArchiveDoc.sheetsById[s].getRows()))
  rows = sheets[0]
  rows = rows.filter(row => row.ioid && row.type).map(row => ({
    ioid: row.ioid,
    type: row.type,
    ...(ok(row.srcURL) ? { srcURL: row.srcURL } : {}),
    ...(ok(row.title) ? { title: row.title } : {}),
    ...(ok(row.publishedAt) ? { publishedAt: row.publishedAt } : {}),
    ...(ok(row.author) ? { author: row.author } : {}),
    ...(ok(row.group) ? { group: row.group } : {}),
    ...(ok(row.platform) ? { platform: row.platform } : {}),
    ...(ok(row.text) ? { text: row.text } : {})
  }))
  // result = Object.assign(result, ...rows.map(row => ({ [row.ioid]: row })))

  // Other data sources
  // ...

  fs.writeFileSync('data/archive.json', JSON.stringify(result, null, '\t'))
}

get()