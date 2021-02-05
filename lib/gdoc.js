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
  $('#contents').removeAttr('id').addClass('content')

  const titleEl = $('p.title')
  let title = '標題未定'
  if(titleEl.length > 0) {
    title = titleEl.text()
    titleEl.remove()
  }
  const subtitleEl = $('p.subtitle')
  let subtitle = null
  if(subtitleEl.length > 0) {
    subtitle = subtitleEl.text()
    subtitleEl.remove()
  }

  const metaTableEl = $('table:first-of-type')
  let coverImage
  let coverImageDescription
  let authorInfo
  let summary
  let summaryHTML
  let tags = []
  if(metaTableEl.length > 0) {
    const fieldElements = metaTableEl.find('td')
    if(fieldElements.length === 5) {
      coverImage = fieldElements.eq(0).html()
      coverImageDescription = fieldElements.eq(1).html
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
    } else { // actually a table
      const container = $('<div class="gdoc-table-container"><div class="table"></div></div>')
      table.before(container)

      const next = table.next()
      if(next && next.get(0) && next.get(0).tagName === 'p') {
        next.remove()
        container.append(next)
        next.attr('class', 'description')
      }

      const tableContainer = container.find('.table')
      table.remove()
      tableContainer.append(table)

      const ctrlRegex = /\s*{{[0-9a-zA-Z-][^{}]+(=.+)?}}\s*/g
      const extractMatchContent = m => m.replace('{{', '').replace('}}', '').trim()

      const UL_SET_CLASS = 'ul-set'
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
              html += `<br/><span class="title">${v}</span>`
            } else if(k === 'status') {
              html += `<span class="status">${v}</span>`
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
          if(classList.includes(UL_SET_CLASS)) {
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
          if(classList.includes(UL_SET_CLASS)) {
            tr.find('ul > li').each(makeSetItem)
          }
        })
      })
    }
  }

  gdoc = $('div.content').html()
  return {
    title,
    subtitle,
    coverImage,
    coverImageDescription,
    authorInfo,
    summary,
    summaryHTML,
    tags,
    html: gdoc
  }
}

function toSectionArray(html, leadTag) {
  const $ = cheerio.load(html)
  const sections = []
  $(leadTag).each((i, el) => {
    let sectionHeader = $(el)
    let sectionBody = sectionHeader.nextUntil(leadTag) // addBack is useful but not here
    sectionHeader = $('<div></div>').append(sectionHeader)
    sectionBody = $('<div></div>').append(sectionBody)
    sections.push({
      header: sectionHeader.html(),
      body: sectionBody.html()
    })
  })
  return sections
}

exports.getDoc = getDoc
exports.toSectionArray = toSectionArray
