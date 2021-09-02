<template>
<div class="page research-article">
  <google-doc :doc="doc" :options="{ showSummary: false }" />
</div>
</template>

<script>
import pathMap from '~/data/paths'
import { getLocalizedArticles } from '~/lib/i18n'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

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
