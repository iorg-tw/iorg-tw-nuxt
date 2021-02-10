function localizeArticle(article, locale, defaultLocale) {
  return article.localizedDocs[locale] ? article.localizedDocs[locale] : article.localizedDocs[defaultLocale]
}

module.exports = {
  localizeArticle
}
