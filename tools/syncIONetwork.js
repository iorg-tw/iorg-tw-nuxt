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
    nodes = nodes.filter(d => d.id && d.fields && d.fields.short_name).map(d => {
      const category = d.fields.category ? d.fields.category : 'default'
      let group = 'none'
      if(['中國', '中共'].some(s => category.includes(s))) {
        group = '中國'
      } else if(category.includes('台灣')) {
        group = '台灣'
      } else if(category.includes('美國')) {
        group = '美國'
      } else if(category === '論壇') {
        group = '論壇'
      }
      return {
        id: d.id,
        name: d.fields.short_name,
        category,
        group,
        notes: d.fields.notes ? d.fields.notes.trim() : null,
        degree: 0
      }
    })

    let edges = await getList('edges')
    edges = edges.filter(d => d.fields && Array.isArray(d.fields.from) && d.fields.from.length > 0 && Array.isArray(d.fields.to) && d.fields.to.length > 0 && d.fields.action).map(d => {
      return {
        source: d.fields.from ? d.fields.from[0] : null,
        target: d.fields.to ? d.fields.to[0] : null,
        action: d.fields.action,
        notes: d.fields.notes ? d.fields.notes.trim() : null,
      }
    })

    for(const node of nodes) {
      node.degree += edges.filter(edge => edge.source === node.id).length
      node.degree += edges.filter(edge => edge.target === node.id).length
    }

    fs.writeFileSync('data/ion/nodes.json', JSON.stringify(nodes, null, '\t'))
    fs.writeFileSync('data/ion/edges.json', JSON.stringify(edges, null, '\t'))
  } catch(error) {
    console.error(error)
  }
}

get()
