<template>
<div class="page profile">
  <google-doc :doc="doc" />
</div>
</template>

<script>
import { getLocalizedArticles } from '~/lib/i18n'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

import articleMap from '~/data/articles'

export default {
  components: {
    GoogleDoc
  },
  async asyncData({ app, params, error }) {
    const id = '_P_' + params.id
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
    return generateMeta(this.doc.title)
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.profile {
  padding: $default-page-padding;
}
</style>
