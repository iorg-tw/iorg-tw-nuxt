import articleMap from '~/data/articles'
import { getDoc } from '~/lib/gdoc'
const { localeFallbackMap } = require('~/data/config')

function localizeArticle(article, locale) {
  const locales = [locale, ...localeFallbackMap[locale]]
  let localizedArticle = null
  for(const loc of locales) { // try locales down the fallback map
    if(article.localizedDocs[loc]) {
      localizedArticle = article.localizedDocs[loc]
      break
    }
  }
  if(!localizedArticle) {
    // eslint-disable-next-line
    console.error('This should not happen')
    localizedArticle = article.localizedDocs[Object.keys(article.localizedDocs)[0]]
  }
  return localizedArticle
}

async function getLocalizedArticles(articleIDs, locale) {
  const articles = articleIDs.map(id => articleMap[id]).filter(a => a !== undefined)
  const localizedDocs = articles.map(a => localizeArticle(a, locale))

  const cache = []
  const promises = []
  for(let i = 0; i < localizedDocs.length; i++) {
    const article = articles[i]
    const localizedDoc = localizedDocs[i]
    if(article.cache && localizedDoc.cache) {
      cache[i] = true
      promises[i] = import('~/data/cached-articles/' + localizedDoc.cache + '.json')
    } else {
      cache[i] = false
      promises[i] = getDoc(localizedDoc.publicURL, localizedDoc.locale, true)
    }
  }
  const docs = await Promise.all(promises)
  for(let i = 0; i < docs.length; i++) {
    // import -> { default: data }
    if(cache[i]) {
      docs[i] = docs[i].default
    }
    // FIXME: this is a hack?
    const doc = docs[i]
    const article = articles[i]
    if(!doc.publishedAt && article.publishedAt) {
      doc.publishedAt = article.publishedAt
    }
    if(!doc.updatedAt && article.updatedAt) {
      doc.updatedAt = article.updatedAt
    }
  }
  return docs
}

export {
  localizeArticle,
  getLocalizedArticles
}
