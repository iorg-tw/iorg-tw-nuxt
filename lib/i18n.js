import articleMap from '~/data/articles'
import { getDoc } from '~/lib/gdoc'

function localizeArticle(article, locale, defaultLocale) {
  return article.localizedDocs[locale] ? article.localizedDocs[locale] : article.localizedDocs[defaultLocale]
}

async function getLocalizedArticles(articleIDs, locale, defaultLocale) {
  const articles = articleIDs.map(id => articleMap[id]).filter(a => a !== undefined)
  const localizedDocs = articles.map(a => a.localizedDocs[locale] ? a.localizedDocs[locale] : a.localizedDocs[defaultLocale])

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
      promises[i] = getDoc(localizedDoc.publicURL)
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
