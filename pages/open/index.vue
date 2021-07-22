<template>
<div class="page article sys">
  <google-doc :doc="doc" />
</div>
</template>

<script>
import { getLocalizedArticles } from '~/lib/i18n'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

export default {
  components: {
    GoogleDoc
  },
  async asyncData({ app, params, error }) {
    const id = '_O'
    const [doc] = await getLocalizedArticles([id], app.i18n.locale, app.i18n.defaultLocale)
    if(!doc) {
      error({ statusCode: 404, message: 'pageNotFound' })
      return
    }
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
