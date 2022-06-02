const { URL } = require('url')
const axios = require('axios')
const cheerio = require('cheerio')

const removeScript = true
const removeStyle = true

const ctrlRegex = /\s*{{\s*[0-9a-zA-Z-][^{}]+(=.+)?\s*}}\s*/g
const extractCtrl = m => m.replace('{{', '').replace('}}', '').trim()
/* control syntax
{{ c }} {{ a=v }}
*/

const regexHexChar = /&#x([A-F\d]+);/g
const toReadableString = html => html.replace(regexHexChar, (m, $1) => String.fromCharCode(parseInt($1, 16)))

const parseHTMLForCtrl = (content) => {
  content = toReadableString(content)
  const matches = content.match(ctrlRegex)
  const classes = []
  const attributes = {}
  if(matches) {
    content = content.replace(ctrlRegex, '').trim()
    matches.map(extractCtrl).forEach(m => {
      if(m.includes('=')) {
        const [k, v] = m.split('=', 2).map(t => ('' + t).trim())
        attributes[k] = (!isNaN(v) ? +v : v)
      } else {
        classes.push('' + m.trim())
      }
    })
  }
  content = content.trim()
  return {
    content,
    classes,
    attributes
  }
}

async function getDoc(publicURL, locale = '_tw') {
  let gdoc = await axios.get(publicURL)
  gdoc = gdoc.data
  // trim lines
  gdoc = gdoc.split('\n').map(line => line.trim())
  gdoc = gdoc.join('')
  // remove
  gdoc = gdoc.replace(/<head[^>]*>.*<\/head>/, '')
  // remove with condition
  if(removeStyle) {
    gdoc = gdoc.replace(/<style[^>]*>.*<\/style>/, '')
  }
  // force remove styling attributes
  gdoc = gdoc.replace(/line-height/g, 'line-height-disabled')

  if(removeScript) {
    gdoc = gdoc.replace(/<script[^>]*>.*<\/script>/, '')
  }

  const replacements = []
  const anchors = gdoc.match(/<\s*a[^>]*>(.*?)<\s*\/\s*a>/g)
  if(anchors) {
    anchors.forEach(match => {
      let replacement = null
      const hrefMatch = match.match(/href="(.+)"/)
      if(hrefMatch) {
        const url = hrefMatch[1]
        const urlObj = new URL(url)
        if(['google.com', 'www.google.com'].includes(urlObj.host) && urlObj.pathname === '/url') {
          replacement = match.replace(url, urlObj.searchParams.get('q'))
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

  gdoc = gdoc.replace(new RegExp(String.fromCharCode(160), 'g'), ' ') // replace nbsp
  gdoc = gdoc.replace(/<span[^>]*>\s*<\/span>/g, '') // remove empty span
  gdoc = gdoc.replace(/<p[^>]*>\s*<\/p>/g, '') // remove empty p

  gdoc = gdoc.replace(/<hr>/g, '<div class="separator"></div>') // make horizontal divider
  gdoc = gdoc.replace(/(X)(-[0-9A-Z]{4}-[0-9A-Z]{4})/g, '<a href="/archive/$1$2" target="_blank" class="ioid"><span>X</span><span>$2</span></a>') // make archive X- link
  gdoc = gdoc.replace(/(DA-)([1-9][0-9]?)/g, '<a href="/da/$2" target="_blank" class="da"><span>DA.$2</span></a>') // make DA link
  gdoc = gdoc.replace(/R-1/, '<a href="/r/r1" target="_blank" class="r"><span>R.1</span></a>') // make R.1 link
  gdoc = gdoc.replace(/([0-9]+)\^(th|st|nd|rd)/g, '$1<sup>$2</sup>') // make superscript

  // cheerio
  let $ = cheerio.load(gdoc)
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
  let authorInfoItemsHTML
  let summary
  let summaryHTML
  let tags = []
  if(metaTableEl.length > 0) {
    const fieldElements = metaTableEl.find('td')
    if(fieldElements.length >= 5) {
      coverImage = fieldElements.eq(0).html()
      coverImageDescHTML = fieldElements.eq(1).html()
      authorInfoItemsHTML = fieldElements.eq(2).find('ul').html()
      summaryHTML = fieldElements.eq(3).html()
      summary = fieldElements.eq(3).text().trim()

      const tagEls = fieldElements.eq(4).find('li')
      if(tagEls.length > 0) {
        tags = fieldElements.eq(4).find('li').toArray().map(el => $(el).text()).filter(t => t !== '')
      }
      const coverImageMatch = coverImage.match(/src="([^"]+)"/)
      if(coverImageMatch) {
        coverImage = coverImageMatch[1]
      } else {
        coverImage = null
      }
      if(authorInfoItemsHTML) {
        authorInfoItemsHTML = authorInfoItemsHTML.replace(/([0-9]{4})\/([0-9]{1,2})\/([0-9]{1,2})/g, '$1.$2.$3')
      }
      metaTableEl.remove()
    }
  }

  const LIST_PFX = 'list-'
  const gdocListClasses = ['list-set']
  const CELL_PFX = 'cell-'
  const COL_PFX = 'col-'
  const COL_WIDTH_PFX = 'w-'
  const conditionalFormatting = {
    danger: ['刪除'],
    nil: ['無', '未發現', 'No', 'None', '相同', '暫無', '無法證偽', 'Unable to disproof', '同上'],
    yes: ['✓', '有', '有證據', 'Yes', 'Proven']
  }

  // tables
  const tables = $('table')
  for(let i = 0; i < tables.length; i++) {
    const table = tables.eq(i)
    const cells = table.find('td')

    // first cell defines table
    const firstCell = cells.eq(0)
    const { content: firstCellContent, classes: firstCellClasses } = parseHTMLForCtrl(firstCell.text()) // attributes: containerAttributes
    const type = firstCellContent
    const containerClasses = firstCellClasses

    if(type === 'end') {
      table.nextAll().remove()
      table.remove()
    } else if(type === 'photo') {
      const images = cells.eq(1).find('img')
      images.removeAttr('style')
      const description = cells.eq(2).find('p')
      description.attr('class', 'description')

      const classesOut = ['gdoc-photo-container', ...containerClasses].join(' ')
      const classesIn = ['images', ...(images.length > 1 ? ['grid'] : [])].join(' ')
      const container = $(`<div class="${classesOut}"><div class="${classesIn}"></div></div>`)
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
    } else if(type === 'post') {
      const classes = ['gdoc-post', ...containerClasses].join(' ')
      const s = cells.length - 1
      const contentHTML = cells.eq(1).html()
      const descriptionHTML = s > 1 ? cells.eq(2).html() : null
      const el = $(`<div class="${classes}">` + `<div class="detail">${contentHTML}</div><a class="handle button small"></a>` + (descriptionHTML ? `<div class="description">${descriptionHTML}</div>` : '') + '</div>')
      table.after(el)
      table.remove()
    } else if(['quote', 'def', 'note'].includes(type)) {
      const s = cells.length - 1
      const headerHTML = ['def', 'quote'].includes(type) ? cells.eq(1).html() : (s > 1 ? cells.eq(1).html() : null)
      const detailHTML = ['def', 'quote'].includes(type) ? (s > 1 ? cells.eq(2).html() : null) : cells.eq(s > 1 ? 2 : 1).html()
      const classes = [`gdoc-${type}`, ...containerClasses].join(' ')
      const el = $(`<div class="${classes}">` + (headerHTML ? `<div class="header">${headerHTML}</div>` : '') + (detailHTML ? `<div class="detail">${detailHTML}</div>` : '') + '</div>')
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
    } else if(containerClasses.includes('infobox')) { // a simple table with no header row
      const container = $('<div class="gdoc-infobox"><div class="table"></div></div>')
      table.before(container)
      table.remove()
      table.find('td').eq(0).text(firstCellContent) // put back cell 0 content without ctrl {{...}}
      container.find('.table').append(table)
    } else { // a table with header row
      const container = $('<div class="gdoc-table-container"><div class="table"></div></div>')
      table.before(container)

      // looking for table description
      const next = table.next()
      if(next && next.get(0) && next.get(0).tagName === 'h4') {
        next.remove()
        next.addClass('description').get(0).tagName = 'p'
        container.append(next)
      }

      // place table in container
      const tableContainer = container.find('.table')
      table.remove()
      tableContainer.append(table)

      // parse table
      /* new implementation */

      const trs = table.find('tr')

      // parse content & ctrl
      // assumption: no merging horizontal cells
      const colClasses = [] // [ [], [], [], ... ]
      trs.each((trIndex, trEl) => {
        const tr = $(trEl)
        const tds = tr.find('td')
        tds.each((tdIndex, tdEl) => {
          const td = $(tdEl)
          if(trIndex === 0) { // this row is header row
            td.get(0).tagName = 'th'
          }

          const tdClasses = []
          const tdChildren = td.children()
          // parse the first child that is not an ul
          const child = tdChildren.not('ul').length > 0 ? td.children().not('ul').eq(0) : null
          if(child) {
            const parsed = parseHTMLForCtrl(child.html())
            child.html(parsed.content)
            tdClasses.push(...parsed.classes.filter(c => c.indexOf(CELL_PFX) === 0))
            if(trIndex === 0) {
              // add a col
              colClasses.push(parsed.classes.filter(c => [COL_PFX, COL_WIDTH_PFX, LIST_PFX].some(p => c.indexOf(p) === 0)))
            }
          }

          // apply col classes to this td if class has CELL or COL PFX
          tdClasses.push(...colClasses[tdIndex].filter(c => [CELL_PFX, COL_PFX, COL_WIDTH_PFX].some(p => c.indexOf(p) === 0)))

          // apply classes to child ul if class has LIST PFX
          const ulClasses = [...new Set(colClasses[tdIndex].filter(c => c.indexOf(LIST_PFX) === 0))]
          if(ulClasses.length > 0) {
            td.find('ul').addClass(ulClasses.join(' '))
          }

          const tdParagraphs = tdChildren.filter('p')
          const tdImages = td.find('img')
          const tdAnchors = td.find('a')

          // simple text
          if(tdChildren.length === 1 && tdParagraphs.length === 1 && tdImages.length === 0 && tdAnchors.length === 0) {
            const tdText = td.text()
            // conditional formatting
            for(const [className, keywords] of Object.entries(conditionalFormatting)) {
              if(keywords.includes(tdText)) {
                tdClasses.push(className)
                break
              }
            }
            // number
            if(tdText.match(/^[0-9,]+(\.[0-9]+)?%?$/)) {
              tdClasses.push('number')
            }
            td.html(`<p>${tdText}</p>`)
            // top-level el in td
            //  ✓ p
            //  ✓ ul
            //  ✓ ol
            //  X img -- p > span > img
          }

          // finally
          td.attr('class', tdClasses.join(' '))
        })
      })
    }
  }
  // end of tables

  // lists
  const uLists = $('ul')
  for(let i = 0; i < uLists.length; i++) {
    const ul = uLists.eq(i)
    const ulClasses = ul.attr('class').split(' ').map(c => c.trim()).filter(c => c.length > 0 && c.indexOf(LIST_PFX) === 0)
    const children = ul.children('li')
    let specialized = ulClasses.some(c => c.indexOf(LIST_PFX) === 0)
    for(let j = 0; j < children.length; j++) {
      const li = children.eq(j)
      const parsed = parseHTMLForCtrl(li.html())
      if(j === 0 && parsed.classes.some(c => c.indexOf(LIST_PFX) === 0)) {
        specialized = true
      }
      if(!specialized) {
        break // no need to process more item
      }
      // apply some attributes to item
      let itemHTML = parsed.content
      for(const [k, v] of Object.entries(parsed.attributes)) {
        if(k === 'title') {
          itemHTML += ' ' + `<br/><span class="title">${v}</span>`
        } else if(k === 'status') {
          itemHTML += ' ' + `<span class="status">${v}</span>`
        }
      }
      li.html(itemHTML)
      li.attr('class', parsed.classes.filter(c => c.indexOf(LIST_PFX) !== 0).join(' '))
      if(j === 0) {
        ulClasses.push(...parsed.classes) // apply all first item classes to list
      }
    }
    // gdoc classes
    ulClasses.push(...ulClasses.filter(c => gdocListClasses.includes(c)).map(c => `gdoc-${c}`))
    // finally
    ul.attr('class', ulClasses.join(' '))
  }

  // illegal tags
  const illegalTags = ['h1', 'h4', 'h5', 'h6']
  illegalTags.forEach(tag => {
    $(tag).each((i, el) => {
      $(el).attr('class', 'illegal-' + tag).get(0).tagName = 'p'
    })
  })

  gdoc = $('div.content').html()

  // stickers
  const { stickers } = require('./const')
  const stickerRE = /\(\([^(]*\)\)/g
  const allMatches = [...gdoc.matchAll(stickerRE)].map(match => ({ s: match[0], index: match.index }))
  allMatches.sort((a, b) => b.index - a.index)
  for(const match of allMatches) {
    let key = match.s.replace(/<\/?span[^>]*>/g, '') // remove <span> interrupting sticker text
    key = key.substring(2, 2 + key.length - 4).trim()
    const label = stickers[key] ? stickers[key][locale] : key
    const classes = stickers[key] ? ['sticker', stickers[key].classes] : ['sticker']
    const sticker = `<label class="${classes.join(' ')}"><span class="content">${label}</span></label>`
    gdoc = gdoc.substring(0, match.index) + sticker + gdoc.substring(match.index + match.s.length)
  }

  // FIXME: temp
  $ = cheerio.load('<div class="content">' + gdoc + '</div>')
  $('h2').each((i, el) => {
    const h2 = $(el)
    const stickers = h2.find('.sticker')
    const stickerContainer = $('<div class="stickers"></div>')
    h2.before(stickerContainer)
    stickers.remove()
    stickerContainer.append(stickers)
  })

  gdoc = $('div.content').html()

  // query str
  gdoc = gdoc.replace(/{{\s?query\s?=\s?([^}]+)\s?}}/g, (match, query = '') => {
    query = query.trim()
    return '<label class="query">' + query + '</label>'
  })

  // clean up
  gdoc = gdoc.replace(/<span[^>]*>\s*<\/span>/g, '') // remove empty span again

  return {
    title,
    ...(subtitle && subtitle.length > 0 ? { subtitle } : {}),
    ...(coverImage ? { coverImage } : {}),
    ...(coverImageDescHTML && coverImageDescHTML.length > 0 ? { coverImageDescHTML } : {}),
    ...(authorInfoItemsHTML && authorInfoItemsHTML.length > 0 ? { authorInfoItemsHTML } : {}),
    ...(summary && summary.length > 0 ? { summary } : {}),
    ...(summaryHTML && summaryHTML.length > 0 ? { summaryHTML } : {}),
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
    debug(indentation + '_f', t0, JSON.stringify(hierarchy), $.text().substring(0, 10) + '...')
    $(t0).each((i, el) => {
      debug(indentation + 'find', t0)
      const headerEl = $(el)
      const bodyEl = headerEl.nextUntil(t0)
      const title = headerEl.text()
      const html = toReadableString($('<div></div>').append(bodyEl).html())
      debug(indentation + 'found', t0, title)
      const next$ = cheerio.load(html)
      const until = hierarchy[1]
      let sibling
      if(hierarchy.length > 1 && next$('body').find(until).length > 0) {
        const bodyElementsBeforeChildren = next$('body').children(until).first().prevAll().get().reverse()
        const bodyHTMLBeforeChildren = toReadableString($('<div></div>').append(bodyElementsBeforeChildren).html())
        sibling = {
          title,
          titleTag: t0,
          html: bodyHTMLBeforeChildren,
          children: _f(html, hierarchy.slice(1))
        }
      } else { // terminate
        sibling = {
          title,
          titleTag: t0,
          html
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
