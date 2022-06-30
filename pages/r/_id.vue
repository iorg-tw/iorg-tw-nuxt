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
  async asyncData({ app, params, error }) {
    const path = '/r/' + params.id // FIXME: hot fix
    const articleID = pathMap[path]
    if(!articleID) {
      error({ statusCode: 404, message: 'pageNotFound' })
      return
    }
    const [doc] = await getLocalizedArticles([articleID], app.i18n.locale)
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
