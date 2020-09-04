const got = require('got')
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()

const apiKey = process.env.AIRTABLE_API_KEY

async function get() {
  try {
    let nodes = await got(`https://api.airtable.com/v0/appu0MNR57XsXL8P6/nodes?api_key=${apiKey}`)
    nodes = JSON.parse(nodes.body).records
    fs.writeFileSync('data/ion/nodes.json', JSON.stringify(nodes, null, '\t'))

    let edges = await got(`https://api.airtable.com/v0/appu0MNR57XsXL8P6/edges?api_key=${apiKey}`)
    edges = JSON.parse(edges.body).records
    fs.writeFileSync('data/ion/edges.json', JSON.stringify(edges, null, '\t'))
  } catch(error) {
    console.error(error)
  }
}

get()
