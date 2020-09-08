const getDoc = require('../lib/gdoc').getDoc

// https://theoephraim.github.io/node-google-spreadsheet/
const fs = require('fs')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const sheetID = process.argv.slice(2)[0]
const dotenv = require('dotenv')
dotenv.config()

const doc = new GoogleSpreadsheet(sheetID)
doc.useApiKey(process.env.GOOGLE_SHEET_API_KEY)

let articleDict = {}

async function sheetToJSON(sheet, type) {
	let rows = await sheet.getRows()
	let dict = Object.assign({}, ...rows.filter(row => row.id && row.publicURL && row.publishedAt).map(row => ({
		[row.id]: {
			published: row.published ? true : false,
			type,
			id: row.id,
			publicURL: row.publicURL,
			publishedAt: row.publishedAt,
			...(row.updatedAt ? { updatedAt: row.updatedAt } : {})
		}
	})))

	for(let id in dict) {
		let article = dict[id]
		let doc = await getDoc(article.publicURL)
		delete doc.summaryHTML
		delete doc.html
		dict[id] = Object.assign(article, doc)
	}
	Object.assign(articleDict, dict)
}

async function get() {
	await doc.loadInfo()
	let sheet

	sheet = doc.sheetsById['0']
	await sheetToJSON(sheet, 'article')
	sheet = doc.sheetsById['339912852']
	await sheetToJSON(sheet, 'video')

	let keys = Object.keys(articleDict)
	console.log(keys)
	keys.sort((p, q) => new Date(articleDict[q].publishedAt) - new Date(articleDict[p].publishedAt))
	console.log(keys)

	articleDict = Object.assign({}, ...keys.map(k => ({ [k]: articleDict[k] })))

	fs.writeFileSync('data/articles.json', JSON.stringify(articleDict, null, '\t'))
}

get()
