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

function ok(str) {
	return str !== null && str !== undefined && str.trim().length > 0
}

async function sheetToJSON(sheet) {
	let rows = await sheet.getRows()
	let dict = Object.assign({}, ...rows.filter(row => row.id && row.publicURL).map(row => ({
		[row.id]: {
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
		}
	})))

	for(let id in dict) {
		let article = dict[id]
		let locales = Object.keys(article.publicURLs)
		console.info(article.id, locales)
		let localizedDocs = await Promise.all(locales.map(locale => getDoc(article.publicURLs[locale])))

		locales.forEach((locale, i) => {
			let doc = localizedDocs[i]
			doc.publicURL = article.publicURLs[locale]
			delete doc.coverImageDescHTML
			delete doc.summaryHTML
			delete doc.html
			article.localizedDocs[locale] = doc
		})

		delete article.publicURLs
		dict[id] = article
	}
	Object.assign(articleDict, dict)
}

async function get() {
	await doc.loadInfo()
	let sheet

	sheet = doc.sheetsById['0']
	await sheetToJSON(sheet)

	// sort keys by publishedAt
	let keys = Object.keys(articleDict)
	keys.sort((p, q) => new Date(articleDict[q].publishedAt) - new Date(articleDict[p].publishedAt))
	articleDict = Object.assign({}, ...keys.map(k => ({ [k]: articleDict[k] })))

	fs.writeFileSync('data/articles.json', JSON.stringify(articleDict, null, '\t'))
}

get()
