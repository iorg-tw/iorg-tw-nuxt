<template>
<div class="page article">
  <google-doc :doc="doc" />
  <actions />
</div>
</template>

<script>
import { getLocalizedArticles } from '~/lib/i18n'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'
import Actions from '~/components/Actions'

import articleMap from '~/data/articles'

export default {
  components: {
    GoogleDoc,
    Actions
  },
  async asyncData({ app, params, error }) {
    const id = params.id
    const article = articleMap[id]
    if(!article) {
      error({ statusCode: 404, message: 'articleNotFound' })
      return
    }

    const [doc] = await getLocalizedArticles([id], app.i18n.locale)
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
