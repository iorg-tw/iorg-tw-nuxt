<template>
<div class="page article sys">
  <google-doc :doc="doc" />
</div>
</template>

<script>
import { getLocalizedArticles } from '~/lib/i18n'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

import pathMap from '~/data/paths'

export default {
  components: {
    GoogleDoc
  },
  async asyncData({ app, route, error }) {
    const path = route.path
    const id = pathMap[path]
    if(!id) {
      error({ statusCode: 404, message: 'pageNotFound' })
      return
    }
    const [doc] = await getLocalizedArticles([id], app.i18n.locale, app.i18n.defaultLocale)
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

.page.article.sys {
  padding: $default-page-padding;
}
</style>
