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
  let authorInfo
  let summary
  let tags = []
  if(metaTableEl.length > 0) {
    const fieldElements = metaTableEl.find('td')
    if(fieldElements.length === 4) {
      coverImage = fieldElements.eq(0).html()
      authorInfo = fieldElements.eq(1).text()
      summary = fieldElements.eq(2).text()
      tags = fieldElements.eq(3).text()

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

  const parents = $('img').closest('p')
  for(let i = 0; i < parents.length; i++) {
    const p = parents.eq(i)
    const images = p.find('img')
    p.addClass('gdoc-image-container')
    p.addClass(images.length > 1 ? 'album' : 'single')
    images.removeAttr('style')
    p.children().remove()
    p.append(images)
    p.get(0).tagName = 'div'
  }

  gdoc = $('div.content').html()
  return {
    title,
    coverImage,
    authorInfo,
    summary,
    tags,
    html: gdoc
  }
}

exports.getDoc = getDoc
