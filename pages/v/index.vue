<i18n lang="yaml">
tw:
  videos: "影音"
en:
  videos: "Videos"
</i18n>

<template>
<div class="page videos">
  <div class="section-header first">
    <p class="section-title-fancy">{{ $t('videos') }}</p>
  </div>
  <article-list type="video" />
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
