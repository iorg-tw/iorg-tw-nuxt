<i18n lang="yaml">
_tw:
  articles: "報導"
_en:
  articles: "Articles"
</i18n>

<template>
<div class="page articles">
  <div class="section-header first">
    <p class="section-title-fancy">{{ $t('articles') }}</p>
  </div>
  <article-list />
</div>
</template>

<script>
import ArticleList from '~/components/ArticleList'

export default {
  components: {
    ArticleList
  }
}
</script>
