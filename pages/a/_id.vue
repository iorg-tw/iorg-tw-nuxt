<template>
<div class="page article">
  <google-doc :doc="doc" />
  <actions />
</div>
</template>

<script>
import { getDoc } from '~/lib/gdoc'
import { localizeArticle } from '~/lib/i18n'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'
import Actions from '~/components/Actions'

import articles from '~/data/articles.json'

export default {
  components: {
    GoogleDoc,
    Actions
  },
  async asyncData({ app, params, error }) {
    const id = params.id
    const article = articles[id]
    if(!article) {
      error({ statusCode: 404, message: 'articleNotFound' })
      return
    }

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

.page.article {
  padding: $default-page-padding;
}
</style>
