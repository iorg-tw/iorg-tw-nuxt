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

  const metaTableEl = $('table:first-of-type')
  let coverImage
  let coverImageDescription
  let authorInfo
  let summary
  let tags = []
  if(metaTableEl.length > 0) {
    const fieldElements = metaTableEl.find('td')
    if(fieldElements.length === 5) {
      coverImage = fieldElements.eq(0).html()
      coverImageDescription = fieldElements.eq(1).html
      authorInfo = fieldElements.eq(2).text()
      summary = fieldElements.eq(3).text()
      tags = fieldElements.eq(4).text()

      const match = coverImage.match(/src="([^"]+)"/)
      if(match) {
        coverImage = match[1]
      } else {
        coverImage = null
      }
      tags = tags.split(PUNCT.PAUSE)
    }
    metaTableEl.remove()
  }

  const tables = $('table')
  for(let i = 0; i < tables.length; i++) {
    const table = tables.eq(i)
    const cells = table.find('td')
    const type = cells.eq(0).text()
    if(type === 'photo') {
      const image = cells.eq(1).find('img')
      const description = cells.eq(2).find('p')
      const imageContainer = $('<div class="gdoc-photo"></div>')
      image.removeAttr('style')
      image.wrap(imageContainer)
      description.attr('class', 'description')
      description.wrap(imageContainer)
      table.after(imageContainer)
      table.remove()
    }
  }

  gdoc = $('div.content').html()
  return {
    title,
    coverImage,
    coverImageDescription,
    authorInfo,
    summary,
    tags,
    html: gdoc
  }
}

exports.getDoc = getDoc
