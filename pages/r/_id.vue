<template>
<div class="page research-article">
  <google-doc :doc="doc" :options="{ showSummary: false }" />
</div>
</template>

<script>
import articleMap from '~/data/articles'
import tree from '~/data/research-tree'
import { getLocalizedArticles } from '~/lib/i18n'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

export default {
  components: {
    GoogleDoc
  },
  async asyncData({ app, params, error }) {
    const id = params.id
    const to = '/r/' + id
    const matchingNodes = tree.filter(node => node.to === to && node.isGenericArticle && articleMap[node.id] && articleMap[node.id].publicURLs._tw)
    if(matchingNodes.length < 1) {
      error({ statusCode: 404, message: 'pageNotFound' })
      return
    }
    const [doc] = await getLocalizedArticles([matchingNodes[0].id], app.i18n.locale, app.i18n.defaultLocale)
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

.page.research-article {
  padding: $default-page-padding;
}
</style>
