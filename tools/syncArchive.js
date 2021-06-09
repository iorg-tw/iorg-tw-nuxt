const fs = require('fs')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const dotenv = require('dotenv')
dotenv.config()

function ok(str) {
  return str !== null && str !== undefined && str.trim().length > 0
}

const displayTypeMap = {
  'png': 'image',
  'jpg': 'image'
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
  rows = rows.filter(row => row.ioid).map(row => ({
    ioid: row.ioid,
    displayType: row.displayType,
    // no type
    ...(ok(row.ft) ? { fileName: row.ioid + '.' + row.ft } : {}),
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

  const synchronizedFiles = require('./synchronizedFiles.json')
  console.info(synchronizedFiles.length, 'files synchronized...')

  const dkArchiveDoc = new GoogleSpreadsheet(process.env.DK_ARCHIVE_FILE_ID)
  dkArchiveDoc.useApiKey(process.env.GOOGLE_SHEET_API_KEY)

  await dkArchiveDoc.loadInfo()
  sheetIDs = [
    '966156440'
  ]
  sheets = await Promise.all(sheetIDs.map(s => dkArchiveDoc.sheetsById[s].getRows()))
  rows = sheets[0]
  rows = rows.filter(row => row.ioid && row.type).map(row => {
    const fileName = synchronizedFiles.find(f => f.includes(row.ioid))
    let fileType, displayType
    if(fileName) {
      fileType = fileName.split('.')[1]
      displayType = displayTypeMap[fileType]
    }
    return Object.assign(row, fileName ? { fileName } : {}, displayType ? { displayType } : {})
  })

  rows = rows.map(row => ({
    ioid: row.ioid,
    displayType: row.displayType,
    type: row.type,
    fileName: row.fileName,
    ...(ok(row.srcURL) ? { srcURL: row.srcURL } : {}),
    ...(ok(row.title) ? { title: row.title } : {}),
    ...(ok(row.publishedAt) ? { publishedAt: row.publishedAt } : {}),
    ...(ok(row.author) ? { author: row.author } : {}),
    ...(ok(row.group) ? { group: row.group } : {}),
    ...(ok(row.platform) ? { platform: row.platform } : {}),
    ...(ok(row.text) ? { text: row.text } : {})
  }))
  result = Object.assign(result, ...rows.map(row => ({ [row.ioid]: row })))

  // Other data sources
  // ...

  fs.writeFileSync('data/archive.json', JSON.stringify(result, null, '\t'))
}

get()