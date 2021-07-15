const axios = require('axios')
const parse = require('url-parse')
const cheerio = require('cheerio')

const removeScript = true
const removeStyle = true

const ctrlRegex = /\s?{{\s?[0-9a-zA-Z-][^{}]+(=.+)?\s?}}\s?/g
const regexHexChar = /&#x([A-F\d]+);/g
const extractMatchContent = m => m.replace('{{', '').replace('}}', '').trim()
const toReadableString = html => html.replace(regexHexChar, (m, $1) => String.fromCharCode(parseInt($1, 16)))
const parseControls = (content) => {
  content = toReadableString(content)
  const matches = content.match(ctrlRegex)
  const classes = []
  const attributes = {}
  if(matches) {
    content = content.replace(ctrlRegex, '').trim()
    matches.map(extractMatchContent).forEach(m => {
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
const parseThenApplyControlsToEl = (_el, $) => {
  const el = $(_el)
  const { content, classes, attributes } = parseControls(el.html())
  let html = content

  el.addClass(classes.join(' '))
  for(const [k, v] of Object.entries(attributes)) {
    if(k === 'title') { // some attributes are applied to innerHTML of el
      html += ' ' + `<br/><span class="title">${v}</span>`
    } else if(k === 'status') {
      html += ' ' + `<span class="status">${v}</span>`
    }
  }
  el.html(html)
}

async function getDoc(publicURL, locale = '_tw') {
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

  gdoc = gdoc.replace(/(X-[0-9A-Z]{4}-[0-9A-Z]{4})/g, '<a href="/archive/$1" target="_blank" class="ioid">$1</a>')

  const stickers = {
    weOK: {
      _tw: '不心慌預報',
      _en: 'We okay',
      class: 'ok'
    },
    poohSays: {
      _tw: '維尼說',
      _en: 'CCP says',
      classes: 'danger'
    },
    waitScience: {
      _tw: '待科學驗證',
      _en: 'Wait for science',
      classes: 'alert'
    },
    suspiciousInfo: {
      _tw: '可疑訊息',
      _en: 'Suspicious',
      classes: 'alert'
    },
    masqOrigin: {
      _tw: '混淆來源',
      _en: 'Masqueraded origin',
      classes: 'bad'
    },
    falseSrc: {
      _tw: '來源錯誤',
      _en: 'False source',
      classes: 'bad'
    },
    falseInfo: {
      _tw: '錯誤訊息',
      _en: 'False',
      classes: 'danger'
    },
    distortedContent: {
      _tw: '變造內容',
      _en: 'Distorted content',
      classes: 'bad'
    },
    falseEq: {
      _tw: '錯誤類比',
      _en: 'False equivalence',
      classes: 'bad'
    },
    clusteredPosting: {
      _tw: '協同發文',
      _en: 'Clustered posting',
      classes: 'bad'
    },
    runData: {
      _tw: '心慌跑資料',
      _en: 'Run data',
      classes: 'highlight'
    },
    followUp: {
      _tw: '心慌追追追',
      _en: 'Follow-up',
      classes: 'highlight'
    },
    iorgOpinion: {
      _tw: 'IORG 觀點',
      _en: 'IORG opinion',
      classes: 'ok'
    }
  }
  for(const key in stickers) {
    const label = stickers[key][locale]
    const classes = stickers[key].classes
    const regex = new RegExp(`{{\\s?${key}\\s?}}`, 'g')
    gdoc = gdoc.replace(regex, `<div class="sticker ${classes}"><div>${label}</div></div>`)
  }

  gdoc = gdoc.replace(/{{\s?search\s?=\s?([^}]+)\s?}}/g, (match, search = '') => {
    search = search.trim()
    search = search.replace(/\[([^\]]+)\]/g, '$1') // FIXME: nested span is weird...
    return '<div class="search">' + search + '</div>'
  })

  gdoc = gdoc.replace(/([0-9]+)\^(th|st|nd|rd)/g, '$1<sup>$2</sup>')

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

  const tables = $('table')
  for(let i = 0; i < tables.length; i++) {
    const table = tables.eq(i)
    const cells = table.find('td')
    const { content: type, classes: containerClasses } = parseControls(cells.eq(0).text()) // attributes: containerAttributes

    if(type === 'photo') {
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
      const html = cells.eq(1).html()
      const el = $(`<div class="${classes}"><div class="detail">${html}</div></div>`)
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
      table.find('td').eq(0).text(type) // put back cell 0 text without ctrl {{...}}
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

      const tableContainer = container.find('.table')
      table.remove()
      tableContainer.append(table)

      const LIST_SET_CLASS = 'list-set'

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
            th.find('ul > li').each((i, el) => parseThenApplyControlsToEl(el, $))
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
      const conditionalFormatting = {
        no: ['無', '未發現', 'No', 'None', '相同'],
        yes: ['✓', '有', '有證據', 'Yes', 'Proven']
      }
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
          const classList = [...colClassLists[tdIndex]]
          const text = td.text()
          for(const [className, keywords] of Object.entries(conditionalFormatting)) {
            if(keywords.includes(text)) {
              classList.push(className)
              break
            }
          }
          td.attr('class', classList.join(' '))
          if(classList.includes(LIST_SET_CLASS)) {
            tr.find('ul > li').each((i, el) => parseThenApplyControlsToEl(el, $))
          }
        })
      })
    }
  }

  const uLists = $('ul')
  for(let i = 0; i < uLists.length; i++) {
    const ul = uLists.eq(i)
    const firstItem = ul.children('li').first()
    if(!firstItem.text().match(/{{\s*list-set\s*}}/)) {
      continue
    }
    const { content: firstItemHTML, classes } = parseControls(firstItem.html())
    firstItem.html(firstItemHTML)
    ul.attr('class', ['gdoc-list-set', ...classes].join(' '))
  }

  const illegalTags = ['h1', 'h4', 'h5', 'h6']
  illegalTags.forEach(tag => {
    $(tag).each((i, el) => {
      $(el).attr('class', 'illegal-' + tag).get(0).tagName = 'p'
    })
  })

  gdoc = $('div.content').html()
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
