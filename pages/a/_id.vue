<template>
<div class="page article">
  <google-doc :doc="doc" />
  <actions />
</div>
</template>

<script>
import { getDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'
import Actions from '~/components/Actions'

import articles from '~/data/articles.json'

export default {
  components: {
    GoogleDoc,
    Actions
  },
  async asyncData({ params, error }) {
    const id = params.id
    const article = articles[id]
    if(!article) {
      error({ statusCode: 404, message: 'Article not found' })
      return
    }
    const doc = await getDoc(article.publicURL)
    return {
      article,
      doc
    }
  },
  head() {
    return generateMeta(this.doc.title, this.doc.summary, this.doc.coverImage)
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.article {
  padding: $default-page-padding;
}
</style>
