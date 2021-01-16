const got = require('got')
const fs = require('fs')
const textMap = require('../lib/const').textMap
const dotenv = require('dotenv')
dotenv.config()

const apiKey = process.env.AIRTABLE_API_KEY

const edgeCats = {
  ctrl: 'control',
  affl: 'affliation',
  info: 'info',
  fc: 'fc'
}
const edgeMatchCases = [
  {
    exps: ['領導', '管理', '經營', '為母集團', '為所屬政黨', '為主導宮廟', '為上級單位', '擁有', '指導', '建立', '出版', '主管', '主持'],
    cat: edgeCats.ctrl,
    dir: 1
  },
  {
    exps: ['邀請前往中國交流', /(為|第\s?[0-9-]*\s?屆)主辦單位/, '相互推薦', '提出糾正案、獲通過', '合作', '參訪', '上節目'],
    cat: edgeCats.affl,
    dir: 0
  },
  {
    exps: ['發起請願', '發表論文', '發文'],
    cat: edgeCats.info,
    dir: 1
  },
  {
    exps: ['錯誤引用', '轉載', '改作', '引用', '專訪', '報導', '回應報導內容', '分享'],
    cat: edgeCats.info,
    dir: -1
  },
  {
    exps: ['貼文含相同關鍵詞', '發表相同內容'],
    cat: edgeCats.info,
    dir: 0
  },
  {
    exps: ['查核'],
    cat: edgeCats.fc,
    dir: -1
  },
  {
    exps: [/^任/],
    cat: edgeCats.ctrl,
    dir: 1
  },
  {
    exps: [/^為/, /^參加/],
    cat: edgeCats.affl,
    dir: 0
  }
]

const linkCats = {
  command: textMap.command
}

async function fetchList(listName) {
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

function readList(listName) {
  let list = fs.readFileSync(`data/airtable/${listName}.json`, { encoding: 'utf8', flag: 'r' })
  list = JSON.parse(list)
  return list
}

function writeList(listName, list, dir = 'airtable') {
  fs.writeFileSync(`data/${dir}/${listName}.json`, JSON.stringify(list, null, '\t'))
}

async function get(remote = false) {
  let allDomains
  let allNodes
  let allEdges
  let allLayouts
  try {
    if(remote) {
      allDomains = await fetchList('domains')
      allNodes = await fetchList('nodes')
      allEdges = await fetchList('edges')
      allLayouts = await fetchList('layouts')

      writeList('domains', allDomains)
      writeList('nodes', allNodes)
      writeList('edges', allEdges)
      writeList('layouts', allLayouts)
    } else {
      allDomains = readList('domains')
      allNodes = readList('nodes')
      allEdges = readList('edges')
      allLayouts = readList('layouts')
    }
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
    let dir = 1
    for(const matchCase of edgeMatchCases) {
      if(matchCase.exps.some(exp => {
        let result = false
        if(exp.constructor.name === 'RegExp') {
          result = action.match(exp)
        } else if(exp.constructor.name === 'String') {
          result = action === exp
        }
        return result
      })) {
        category = matchCase.cat
        dir = matchCase.dir
      }
    }
    let notes = d.fields.notes ? d.fields.notes.trim() : null
    return {
      id: d.id,
      source: d.fields.from ? d.fields.from[0] : null,
      target: d.fields.to ? d.fields.to[0] : null,
      action,
      category,
      dir,
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
    const config = JSON.parse(l.fields.config ? l.fields.config : '{}')
    return {
      id: l.fields.id,
      name: l.fields.name,
      ...config
    }
  })

  try {
    writeList('domains', allDomains, 'ion')
    writeList('nodes', allNodes, 'ion')
    writeList('edges', allEdges, 'ion')
    writeList('layouts', allLayouts, 'ion')
  } catch(error) {
    console.error(error)
  }
}

get()
