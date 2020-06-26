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
	let articleDict = Object.assign({}, ...rows.map(row => ({
		[row.id]: {
			id: row.id,
			publicURL: row.publicURL,
			publishedAt: row.publishedAt,
			updatedAt: row.updatedAt
		}
	})))

	for(let id in articleDict) {
		let article = articleDict[id]
		let doc = await getDoc(article.publicURL)
		delete doc.html
		articleDict[id] = Object.assign(article, doc)
	}
	fs.writeFileSync('data/articles.json', JSON.stringify(articleDict, null, '\t'))
}

get()