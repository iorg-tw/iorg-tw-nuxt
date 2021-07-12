const fs = require('fs')
const path = require('path')
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

  const importedDokiFiles = JSON.parse(fs.readFileSync(path.resolve(process.env.ARCHIVE_REPO_LOCAL_PATH, 'scripts', 'import-doki-imported.json'))).map(row => {
    const [ioid, ext] = row.split('.')
    return { ioid, ext }
  })
  console.info(importedDokiFiles.length, 'imported Dokidoki Archive files...')

  const dokiDoc = new GoogleSpreadsheet(process.env.DK_ARCHIVE_FILE_ID)
  dokiDoc.useApiKey(process.env.GOOGLE_SHEET_API_KEY)

  await dokiDoc.loadInfo()
  sheetIDs = [
    '966156440'
  ]
  sheets = await Promise.all(sheetIDs.map(s => dokiDoc.sheetsById[s].getRows()))
  rows = sheets[0]

  const importedLocalFiles = rows.filter(row => row.ioid && row.archivist_p).map(row => ({ [row.ioid]: { ioid: row.ioid, ext: row.archivist_ext } }))
  console.info(importedLocalFiles.length, 'imported local files...')

  const importedFileMap = Object.assign({}, ...importedDokiFiles, ...importedLocalFiles)

  rows = rows.filter(row => row.ioid && row.type).map(row => {
    const importedFile = importedFileMap[row.ioid]
    const fileName = importedFile ? importedFile.ioid + '.' + importedFile.ext : null
    const displayType = importedFile ? displayTypeMap[importedFile.ext] : null
    const publishedAt = (row.publishedAt ? row.publishedAt : '').replace(/\s/g, ' ')
    const archivedAt = (row.archivedAt ? row.archivedAt : row['Timestamp']).replace(/\s/g, ' ')

    return {
      ioid: row.ioid,
      type: row.type,
      ...(fileName ? { fileName } : {}),
      ...(displayType ? { displayType } : {}),
      ...(publishedAt ? { publishedAt } : {}),
      ...(archivedAt ? { archivedAt } : {}),
      ...(ok(row.srcURL) ? { srcURL: row.srcURL } : {}),
      ...(ok(row.title) ? { title: row.title } : {}),
      ...(ok(row.author) ? { author: row.author } : {}),
      ...(ok(row.group) ? { group: row.group } : {}),
      ...(ok(row.platform) ? { platform: row.platform } : {}),
      ...(ok(row.text) ? { text: row.text } : {})
    }
  })
  result = Object.assign(result, ...rows.map(row => ({ [row.ioid]: row })))

  // Other data sources
  // ...

  fs.writeFileSync('data/archive.json', JSON.stringify(result, null, '\t'))
}

get()