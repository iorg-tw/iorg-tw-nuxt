const PUNCT = require('./const.js').PUNCT

export function optimizeTracking(text) {
  if([PUNCT.L.FBRAC, PUNCT.L.QUOTE].includes(text.substring(0, 1))) {
    text = '<span class="punct-l-fbrac">' + text.substring(0, 1) + '</span>' + text.substring(1)
  }
  return text
}
