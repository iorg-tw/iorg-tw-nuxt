<i18n lang="yaml">
_tw:
  articles: "報導"
  title: "報導"
  description: "IORG 中國對台影響力作戰相關報導"
_en:
  articles: "Articles"
  title: "Articles"
  description: "Articles on Chinese Influence Operations Against Taiwan"
</i18n>

<template>
<div class="page articles">
  <div class="section-header first">
    <p class="section-title">{{ $t('articles') }}</p>
  </div>
  <article-list />
</div>
</template>

<script>
import { generateMeta } from '~/lib/meta'
import ArticleList from '~/components/ArticleList'

export default {
  components: {
    ArticleList
  },
  head() {
    return generateMeta(this.$t('title'), null, this.$t('description'))
  }
}
</script>
