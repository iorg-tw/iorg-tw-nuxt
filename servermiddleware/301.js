const redirects = require('../301.js')
const locales = require('../nuxt.config.js').default.i18n.locales.map(locale => locale.code)

module.exports = function(req, res, next) {
  let to = null
  redirects.some(r => {
    let from = req.url.substring(1).split('/') // remove leading /
    let locale = null
    if(locales.includes(from[0])) { // first part is locale
      locale = from.shift()
    }
    from = '/' + from.join('/')
    if(r.from instanceof RegExp && from.match(r.from)) {
      to = from.replace(r.from, r.to)
    } else if(from === r.from) {
      to = r.to
    }
    return to !== null
  })
  if(to) {
    console.log(`${req.url} => ${to}`)
    res.writeHead(301, { Location: to })
    res.end()
  } else {
    next()
  }
}
