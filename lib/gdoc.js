const axios = require('axios')
const parse = require('url-parse')
const cheerio = require('cheerio')
const PUNCT = require('./const.js').PUNCT

const removeScript = true
const removeStyle = true

async function getDoc(publicURL) {
  let gdoc = await axios.get(publicURL)
  gdoc = gdoc.data
  // trim lines
  gdoc = gdoc.split('\n').map(line => line.trim())
  gdoc = gdoc.join('')
  // remove
  gdoc = gdoc.replace(/<head.*>.*<\/head>/, '')
  // remove with condition
  if(removeStyle) {
    gdoc = gdoc.replace(/<style.*>.*<\/style>/, '')
  }
  // force remove styling attributes
  gdoc = gdoc.replace(/line-height/g, 'attr-disabled')

  if(removeScript) {
    gdoc = gdoc.replace(/<script.*>.*<\/script>/, '')
  }
  const replacements = []
  const anchors = gdoc.match(/<\s*a[^>]*>(.*?)<\s*\/\s*a>/g)
  if(anchors) {
    anchors.forEach(match => {
      let replacement = null
      const hrefMatch = match.match(/href="(.+)"/)
      if(hrefMatch) {
        const url = hrefMatch[1]
        const parsed = parse(url, true)
        if(['google.com', 'www.google.com'].includes(parsed.host) && parsed.pathname === '/url') {
          replacement = match.replace(url, parsed.query.q)
        }
      }
      if(replacement) {
        replacements.push({
          find: match,
          replace: replacement
        })
      }
    })
  }
  replacements.forEach(replacement => {
    gdoc = gdoc.replace(replacement.find, replacement.replace)
  })

  gdoc = gdoc.replace(/<\s*p[^>]*><\s*span[^>]*><\s*\/\s*span><\s*\/\s*p>/g, '') // remove empty p

  gdoc = gdoc.replace(/<hr>/g, '<div class="separator"></div>') // replace horizontal divider

  // cheerio
  const $ = cheerio.load(gdoc)
  $('#header, #footer').remove()
  $('#contents').removeAttr('id').children().first().addClass('content')

  const titleEl = $('p.title')
  let title = '標題未定'
  if(titleEl.length > 0) {
    title = titleEl.text()
    titleEl.remove()
  }
  const subtitleEl = $('p.subtitle')
  let subtitle = ''
  if(subtitleEl.length > 0) {
    subtitle = subtitleEl.text()
    subtitleEl.remove()
  }

  const metaTableEl = $('table:first-of-type')
  let coverImage
  let coverImageDescHTML
  let authorInfo
  let summary
  let summaryHTML
  let tags = []
  if(metaTableEl.length > 0) {
    const fieldElements = metaTableEl.find('td')
    if(fieldElements.length === 5) {
      coverImage = fieldElements.eq(0).html()
      coverImageDescHTML = fieldElements.eq(1).html()
      authorInfo = fieldElements.eq(2).text()
      if(authorInfo) {
        authorInfo = authorInfo.split(PUNCT.SEMICOL)
      }
      summaryHTML = fieldElements.eq(3).html()
      summary = fieldElements.eq(3).text()
      tags = fieldElements.eq(4).text()

      const match = coverImage.match(/src="([^"]+)"/)
      if(match) {
        coverImage = match[1]
      } else {
        coverImage = null
      }
      tags = tags.split(PUNCT.PAUSE).filter(tag => tag !== '')
    }
    metaTableEl.remove()
  }

  const tables = $('table')
  for(let i = 0; i < tables.length; i++) {
    const table = tables.eq(i)
    const cells = table.find('td')
    const type = cells.eq(0).text()
    if(type === 'photo') {
      const images = cells.eq(1).find('img')
      images.removeAttr('style')
      const description = cells.eq(2).find('p')
      description.attr('class', 'description')

      const classes = images.length > 1 ? 'grid' : ''
      const container = $(`<div class="gdoc-photo-container"><div class="images ${classes}"></div></div>`)
      table.after(container)
      const imageContainer = container.find('.images')
      imageContainer.append(images)
      container.append(description)
      table.remove()
    } else if(type === 'youtube') {
      const videoID = cells.eq(1).text()
      const el = $(`<div class="gdoc-youtube-container"><div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${videoID}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div>`)
      table.after(el)
      table.remove()
    } else if(['def', 'note'].includes(type)) {
      const s = cells.length - 1
      const headerHTML = type === 'def' ? cells.eq(1).html() : (s > 1 ? cells.eq(2).html() : null)
      const detailHTML = type === 'def' ? (s > 1 ? cells.eq(2).html() : null) : cells.eq(s > 1 ? 2 : 1).html()
      const el = $(`<div class="gdoc-${type}">` + (headerHTML ? `<div class="header">${headerHTML}</div>` : '') + (detailHTML ? `<div class="detail">${detailHTML}</div>` : '') + '</div>')
      table.after(el)
      table.remove()
    } else if(type === 'references') {
      const detailHTML = cells.eq(1).html()
      const el = $('<div class="gdoc-references"></div>')
      el.append(detailHTML)
      table.after(el)
      table.remove()
    } else if(type === 'actions') {
      const actions = cells.eq(1).find('a').addClass('button action')
      actions.first().addClass('primary')
      actions.slice(1).addClass('secondary')
      const el = $('<div class="gdoc-actions"></div>')
      el.append(actions)
      table.after(el)
      table.remove()
    } else { // actually a table
      const container = $('<div class="gdoc-table-container"><div class="table"></div></div>')
      table.before(container)

      const next = table.next()
      if(next && next.get(0) && next.get(0).tagName === 'h4') {
        next.remove()
        const newEl = $(`<p class="description">${next.html()}</p>`)
        container.append(newEl)
      }

      const tableContainer = container.find('.table')
      table.remove()
      tableContainer.append(table)

      const ctrlRegex = /\s*{{[0-9a-zA-Z-][^{}]+(=.+)?}}\s*/g
      const extractMatchContent = m => m.replace('{{', '').replace('}}', '').trim()

      const LIST_SET_CLASS = 'list-set'
      const regexHexChar = /&#x([A-F\d]+);/g
      const toReadableString = html => html.replace(regexHexChar, (m, $1) => String.fromCharCode(parseInt($1, 16)))
      const makeSetItem = (liIndex, liEl) => {
        const li = $(liEl)
        let html = toReadableString(li.html())
        let matches = html.match(ctrlRegex)
        if(matches) {
          html = html.replace(ctrlRegex, '') // content already wrapped in <span>
          matches = matches.map(extractMatchContent)

          const classes = []
          const attributes = []
          matches.forEach(m => (m.includes('=') ? attributes : classes).push(m))
          li.addClass(classes.join(' '))
          attributes.forEach(a => {
            const [k, v] = a.split('=').map(t => ('' + t).trim())
            if(k === 'title') {
              html += ' ' + `<br/><span class="title">${v}</span>`
            } else if(k === 'status') {
              html += ' ' + `<span class="status">${v}</span>`
            }
          })
          li.html(html)
        }
      }

      // header row
      const trs = table.find('tr')
      const headerRow = trs.eq(0)
      const colClassLists = []
      headerRow.find('td').each((i, el) => {
        const th = $(el)
        const thText = th.text()
        const matches = thText.match(ctrlRegex)
        if(matches) {
          const classList = matches.map(extractMatchContent)
          if(classList.includes(LIST_SET_CLASS)) {
            th.find('ul > li').each(makeSetItem)
          }
          th.html(th.html().replace(ctrlRegex, '')) // gdoc cell text are all wrapped in p
          th.addClass(classList.join(' '))
          colClassLists.push(classList)
        } else {
          colClassLists.push([])
        }
        th.get(0).tagName = 'th'
      })

      // rows
      let maxColCount = headerRow.find('td').length
      trs.each((trIndex, trEl) => {
        const tr = $(trEl)
        const tds = tr.find('td')
        const colCount = tds.length
        maxColCount = trIndex < 1 ? colCount : (colCount > maxColCount ? colCount : maxColCount)
        if(colCount < maxColCount) {
          tr.attr('class', 'no-border')
        }
        tds.each((tdIndex, tdEl) => {
          const td = $(tdEl)
          const classList = colClassLists[tdIndex]
          td.attr('class', classList.join(' '))
          if(classList.includes(LIST_SET_CLASS)) {
            tr.find('ul > li').each(makeSetItem)
          }
        })
      })
    }
  }

  gdoc = $('div.content').html()
  return {
    title,
    ...(subtitle && subtitle.length > 0 ? { subtitle } : {}),
    coverImage,
    ...(coverImageDescHTML && coverImageDescHTML.length > 0 ? { coverImageDescHTML } : {}),
    authorInfo,
    summary,
    summaryHTML,
    tags,
    html: gdoc
  }
}

const shouldPrint = false
function debug() {
  if(shouldPrint) {
    // eslint-disable-next-line
    console.info(...arguments)
  }
}

function structureDoc(HTML, H) {
  const totalLevels = H.length
  debug('structureDoc', totalLevels, 'levels')
  const _f = (html, hierarchy) => {
    const $ = cheerio.load(html)
    const t0 = hierarchy[0]
    const siblings = []
    const currentLevel = totalLevels - hierarchy.length
    const indentation = new Array(currentLevel * 4).join(' ')
    debug(indentation + '_f', t0, JSON.stringify(hierarchy))
    $(t0).each((i, el) => {
      debug(indentation + 'find', t0)
      const headerEl = $(el)
      const bodyEl = headerEl.nextUntil(t0)
      const title = headerEl.text()
      const html = $('<div></div>').append(bodyEl).html()
      debug(indentation + 'found', t0, title)
      let sibling
      if(hierarchy.length < 2) {
        sibling = {
          title,
          titleTag: t0,
          html
        }
      } else {
        const next$ = cheerio.load(html)
        const until = hierarchy[1]
        const bodyElementsBeforeChildren = next$('body').children(until).first().prevAll().get().reverse()
        const bodyHTMLBeforeChildren = $('<div></div>').append(bodyElementsBeforeChildren).html()
        sibling = {
          title,
          titleTag: t0,
          html: bodyHTMLBeforeChildren,
          children: _f(html, hierarchy.slice(1))
        }
      }
      siblings.push(sibling)
    })
    return siblings
  }
  return _f(HTML, H)
}

exports.getDoc = getDoc
exports.structureDoc = structureDoc
