<template>
<div class="page article">
  <google-doc :gdoc="gdoc.html" />
</div>
</template>

<script>
import { getDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/util'
import GoogleDoc from '~/components/GoogleDoc'

import articles from '~/data/articles.json'

export default {
  components: {
    GoogleDoc
  },
  async asyncData({ params, error }) {
    const id = params.id
    const article = articles[id]
    if(!article) {
      error({ statusCode: 404, message: 'Article not found' })
      return
    }
    console.log(article)
    const gdoc = await getDoc(article.publicURL)
    return {
      article,
      gdoc
    }
  },
  head() {
    const pageTitle = this.gdoc.title
    const pageDescription = 'test description'
    return generateMeta(pageTitle, pageDescription)
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.article {
  padding: $default-page-padding;
}
</style>
