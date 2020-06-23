import axios from 'axios'
const parse = require('url-parse')
const cheerio = require('cheerio')

const removeScript = true
const removeStyle = true

export async function getDoc(publicURL) {
  let gdoc = await axios.get(publicURL)
  gdoc = gdoc.data
  console.log(gdoc)
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
  let images = gdoc.match(/<\s*p[^>]*><\s*span[^>]*><\s*img[^>]*><\s*\/\s*span><\s*\/\s*p>/g)
  images = images ? images : []
  images.forEach(match => {
    let replacement = null
    const pClassMatch = match.match(/p[^>]+class="([^"]+)"/)
    if(pClassMatch) {
      const originalMatch = pClassMatch[0]
      const originalClasses = pClassMatch[1]
      const newClasses = [originalClasses, 'gdoc-image-container'].join(' ')
      const matchUpdate = originalMatch.replace(originalClasses, newClasses)
      replacement = match.replace(originalMatch, matchUpdate)
    }
    if(replacement) {
      replacements.push({
        find: match,
        replace: replacement
      })
    }
  })

  let anchors = gdoc.match(/<\s*a[^>]*>(.*?)<\s*\/\s*a>/g) // (/<a [^>]+>[^<]+<\/a>/g)
  anchors = anchors ? anchors : []
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
  replacements.forEach(replacement => {
    gdoc = gdoc.replace(replacement.find, replacement.replace)
  })

  // unwrap
  gdoc = gdoc.replace('<body>', '')
  gdoc = gdoc.replace('</body>', '')
  gdoc = gdoc.replace('<html>', '')
  gdoc = gdoc.replace('</html>', '')

  // clean up
  gdoc = gdoc.replace('<!DOCTYPE html>', '')

  // cheerio
  const $ = cheerio.load(gdoc)
  $('#header, #footer').remove()
  $('#contents').removeAttr('id').addClass('content')

  const titleEl = $('p.title')
  const title = '標題未定'
  if(titleEl.length > 0) {
    title = titleEl.text()
    titleEl.get(0).tagName = 'h1'
  }

  gdoc = $.html()
  return {
    title,
    html: gdoc
  }
}
