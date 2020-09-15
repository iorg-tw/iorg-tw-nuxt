const getDoc = require('../lib/gdoc').getDoc

// https://theoephraim.github.io/node-google-spreadsheet/
const fs = require('fs')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const sheetID = process.argv.slice(2)[0]
const dotenv = require('dotenv')
dotenv.config()

const doc = new GoogleSpreadsheet(sheetID)
doc.useApiKey(process.env.GOOGLE_SHEET_API_KEY)

async function get() {
  await doc.loadInfo()
  const sheet = doc.sheetsById['0']
  const rows = await sheet.getRows()
  const events = rows.filter(row => row.area && row.name && row.date).map(row => ({
    show: row.show ? true : false,
    area: row.area,
    name: row.name,
    loc: row.loc ? row.loc : null,
    year: +row.year,
    date: row.date,
    dow: row.dow,
    time: row.start ? [row.start, ...(row.end ? [row.end] : [])].join('-') : row.time
  }))

  fs.writeFileSync('data/events.json', JSON.stringify(events, null, '\t'))
}

get()
