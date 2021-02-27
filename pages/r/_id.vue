<template>
<div class="page research">
  <google-doc :doc="doc" :options="{ showSummary: false }" />
</div>
</template>

<script>
import articleMap from '~/data/articles'
import tree from '~/data/research-tree'
import { getDoc } from '~/lib/gdoc'
import { localizeArticle } from '~/lib/i18n'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

export default {
  components: {
    GoogleDoc
  },
  async asyncData({ app, params, error }) {
    const id = params.id
    const to = '/r/' + id
    const matchingNodes = tree.filter(node => node.to === to && node.isArticle && articleMap[node.id] && articleMap[node.id].publicURLs._tw)
    if(matchingNodes.length < 1) {
      error({ statusCode: 404, message: 'pageNotFound' })
      return
    }
    const node = matchingNodes[0]
    const article = articleMap[node.id]
    const doc = await getDoc(localizeArticle(article, app.i18n.locale, app.i18n.defaultLocale).publicURL)
    // FIXME: this is a hack
    if(article.publishedAt) {
      doc.publishedAt = article.publishedAt
    }
    if(article.updatedAt) {
      doc.updatedAt = article.updatedAt
    }
    return {
      doc
    }
  },
  head() {
    return generateMeta(this.doc.title, this.doc.subtitle, this.doc.summary, this.doc.coverImage)
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.research {
  padding: $default-page-padding;
}
</style>
