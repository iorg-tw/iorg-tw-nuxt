<i18n lang="yaml">
_tw:
  articles: "週報"
  title: "心慌週報"
  description: "IORG 資訊操弄心慌週報"
_en:
  articles: "Weekly"
  title: "Dokidoki Alert Weekly"
  description: "IORG Dokidoki Alert Weekly"
</i18n>

<template>
<div class="page articles">
  <div class="section-header first">
    <p class="section-title-fancy">{{ $t('articles') }}</p>
  </div>
  <article-list type="da" />
  <google-doc :doc="doc" :options="{ metaphor: 'page', head: false }" class="doc-doki-list" />
</div>
</template>

<script>
import { generateMeta } from '~/lib/meta'
import { getLocalizedArticles } from '~/lib/i18n'
import ArticleList from '~/components/ArticleList'
import GoogleDoc from '~/components/GoogleDoc'

const DOKI_LIST = 'dokidoki-listing'

export default {
  components: {
    ArticleList,
    GoogleDoc
  },
  async asyncData({ app }) {
    const [doc] = await getLocalizedArticles([DOKI_LIST], app.i18n.locale, app.i18n.defaultLocale)
    return {
      doc
    }
  },
  head() {
    return generateMeta(this.$t('title'), null, this.$t('description'))
  }
}
</script>
