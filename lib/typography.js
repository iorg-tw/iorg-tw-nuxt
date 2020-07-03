const PUNCT = require('./const.js').PUNCT

export function optimizeTracking(text) {
  if(text.substring(0, 1) === PUNCT.L.FBRAC) {
    text = '<span class="punct-l-fbrac">' + PUNCT.L.FBRAC + '</span>' + text.substring(1)
  }
  return text
}
