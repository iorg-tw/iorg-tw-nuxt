const locales = require('../nuxt.config.js').default.i18n.locales.map(locale => locale.code)
const redirects = require('../301.js')
const libRedirects = require('../data/redirects.json')

redirects.push(...libRedirects.filter(entry => entry.active))

module.exports = function(req, res, next) {
  let from = req.url.split('?').shift() // remove params // FIXME: should parse
  let to = null
  let locale = null
  redirects.some(r => {
    from = from.substring(1).split('/')
    locale = null
    if(locales.includes(from[0])) { // first part is locale
      locale = from.shift()
    }
    from = '/' + from.join('/')
    if(r.from instanceof RegExp && from.match(r.from)) {
      to = from.replace(r.from, r.to)
    } else if(typeof from === 'string' && typeof r.from === 'string' && from.toLowerCase() === r.from.toLowerCase()) {
      to = r.to
    } else if(r.from === from) {
      to = r.to
    }
    return to !== null
  })
  if(to) {
    console.log(`${req.url} => ${from} => ${to}`)
    res.writeHead(301, { Location: to })
    res.end()
  } else {
    next()
  }
}
