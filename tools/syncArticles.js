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
	let rows = await sheet.getRows()
	rows = Object.assign({}, ...rows.map(row => ({
		[row.id]: {
			id: row.id,
			publicURL: row.publicURL,
			tags: [row.primaryTag, row.secondaryTag, row.thirdTag, row.fourthTag, row.fifthTag].filter(v => (v !== undefined && v !== ''))
		}
	})))
	fs.writeFileSync('data/articles.json', JSON.stringify(rows))
}

get()