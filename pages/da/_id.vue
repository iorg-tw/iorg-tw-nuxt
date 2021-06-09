<template>
<div class="page article">
  <google-doc :doc="doc" />
  <div class="subscribe">
    <subscribe-simple context="article" />
  </div>
  <actions />
</div>
</template>

<script>
import { getLocalizedArticles } from '~/lib/i18n'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'
import SubscribeSimple from '~/components/SubscribeSimple'
import Actions from '~/components/Actions'

import articleMap from '~/data/articles'

export default {
  components: {
    GoogleDoc,
    SubscribeSimple,
    Actions
  },
  async asyncData({ app, params, error }) {
    const id = '_DA_' + params.id // FIXME: hack
    const article = articleMap[id]
    if(!article) {
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

.page.article {
  padding: $default-page-padding;
  .subscribe {
    margin: 2rem 0;
    > .subscribe-simple { // FIXME: hack
      margin-right: auto;
      margin-left: auto;
    }
  }
}
</style>
