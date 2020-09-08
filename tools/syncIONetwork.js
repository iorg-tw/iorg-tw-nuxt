const got = require('got')
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()

const apiKey = process.env.AIRTABLE_API_KEY

async function getList(listName) {
  let list = []
  let offset = 0
  while(offset !== '' && offset !== null && offset !== undefined) {
    const url = `https://api.airtable.com/v0/appu0MNR57XsXL8P6/${listName}?offset=${offset ? offset : ''}&api_key=${apiKey}`
    let res = await got(url)
    res = JSON.parse(res.body)
    list = list.concat(res.records)
    offset = res.offset
  }
  return list
}

async function get() {
  try {
    let nodes = await getList('nodes')
    nodes = nodes.map(d => {
      return {
        id: d.id,
        name: d.fields.short_name,
        category: d.fields.category ? d.fields.category : 'default'
      }
    }).filter(d => d.id && d.name)
    fs.writeFileSync('data/ion/nodes.json', JSON.stringify(nodes, null, '\t'))

    let edges = await getList('edges')
    edges = edges.map(d => {
      return {
        source: d.fields.from ? d.fields.from[0] : null,
        target: d.fields.to ? d.fields.to[0] : null,
        action: d.fields.action,
        value: 4 // placeholder
      }
    }).filter(d => d.source && d.target && d.action)
    fs.writeFileSync('data/ion/edges.json', JSON.stringify(edges, null, '\t'))
  } catch(error) {
    console.error(error)
  }
}

get()
