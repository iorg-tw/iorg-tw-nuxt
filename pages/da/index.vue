<i18n lang="yaml">
_tw:
  articles: "週報"
  title: "週報"
  description: "IORG 週報"
_en:
  articles: "Reports"
  title: "Reports"
  description: "IORG Reports"
</i18n>

<template>
<div class="page articles">
  <div class="section-header first">
    <p class="section-title">{{ $t('articles') }}</p>
  </div>
  <article-list type="da" />
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
