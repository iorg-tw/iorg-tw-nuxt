const got = require('got')
const fs = require('fs')
const textMap = require('../lib/const').textMap
const dotenv = require('dotenv')
dotenv.config()

const apiKey = process.env.AIRTABLE_API_KEY

const edgeCategories = [
  {
    id: textMap.command,
    keywords: ['上級', '組長', '所屬', '主管', '里長', '母集團', '母公司', '主導', '主任', '領導', '院長', '政治委員', '校長', '會長', '董事長', '市長', '理事長', '主席', '擁有', '旗下', '直屬', '指揮', '主辦', '承辦', '協辦', '書記', '直接管理', '指導']
  }
]

const linkCats = {
  command: textMap.command
}

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
  let allDomains
  let allNodes
  let allEdges
  let allLayouts
  try {
    allDomains = await getList('domains')
    allNodes = await getList('nodes')
    allEdges = await getList('edges')
    allLayouts = await getList('layouts')
  } catch(error) {
    console.error(error)
  }

  allDomains = allDomains.filter(d => d.fields.show)
  allDomains.sort((a, b) => a.fields.order - b.fields.order)
  allDomains = Object.assign({}, ...allDomains.map(d => ({ [d.id]: d.fields.name })))

  allNodes = allNodes.filter(d => d.id && d.fields && d.fields.short_name).map(d => {
    const category = d.fields.category ? d.fields.category : 'default'
    const notes = d.fields.notes ? d.fields.notes.trim() : null
    let group = textMap.none
    if([textMap.china, textMap.ccp].some(s => category.includes(s))) {
      group = textMap.china
    } else if(category.includes(textMap.tw)) {
      group = textMap.tw
    } else if(category.includes(textMap.hk)) {
      group = textMap.hk
    } else if(category.includes(textMap.usa)) {
      group = textMap.usa
    } else if(category.includes(textMap.forum)) {
      group = textMap.forum
    }
    return {
      id: d.id,
      name: d.fields.short_name,
      category,
      group,
      notes,
      degree: 0
    }
  })

  allEdges = allEdges.filter(d => d.fields && Array.isArray(d.fields.from) && d.fields.from.length > 0 && Array.isArray(d.fields.to) && d.fields.to.length > 0 && d.fields.action).map(d => {
    let action = d.fields.action
    let domains = d.fields.domains ? d.fields.domains : []
    let category = textMap.default
    for(const cat of edgeCategories) {
      if(cat.keywords.some(k => action.includes(k))) {
        category = cat.id
      }
    }
    let notes = d.fields.notes ? d.fields.notes.trim() : null
    return {
      id: d.id,
      source: d.fields.from ? d.fields.from[0] : null,
      target: d.fields.to ? d.fields.to[0] : null,
      action,
      category,
      domains,
      notes
    }
  })

  // calculate degree for nodes
  for(const node of allNodes) {
    node.degree += allEdges.filter(edge => edge.source === node.id).length
    node.degree += allEdges.filter(edge => edge.target === node.id).length
  }

  for(const domainID in allDomains) {
    const edges = allEdges.filter(edge => edge.domains.some(d => d === domainID))

    // trace up the command chain
    const linkedNodes = edges.map(edge => [edge.source, edge.target]).flat()
    let nc = 0
    for(const n of linkedNodes) {
      const commandingEdges = allEdges.filter(l => l.category === linkCats.command && l.target === n)
      for(const edge of commandingEdges) {
        const m = edge.source
        linkedNodes.push(m)
      }
      edges.push(...commandingEdges)
      nc += 1
    }

    // add domains to edges
    for(const edge of edges) {
      if(!edge.domains.includes(domainID)) {
        edge.domains.push(domainID)
      }
    }
  }

  allLayouts.sort((a, b) => a.fields.order - b.fields.order)
  allLayouts = allLayouts.map(l => {
    const config = JSON.parse(l.fields.config)
    return {
      id: l.fields.id,
      name: l.fields.name,
      domains: l.fields.domains ? l.fields.domains : [],
      ...config
    }
  })

  try {
    fs.writeFileSync('data/ion/domains.json', JSON.stringify(allDomains, null, '\t'))
    fs.writeFileSync('data/ion/nodes.json', JSON.stringify(allNodes, null, '\t'))
    fs.writeFileSync('data/ion/edges.json', JSON.stringify(allEdges, null, '\t'))
    fs.writeFileSync('data/ion/layouts.json', JSON.stringify(allLayouts, null, '\t'))
  } catch(error) {
    console.error(error)
  }
}

get()
