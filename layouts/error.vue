<i18n lang="yaml">
_tw:
  articleNotFound: "查無此報導"
  goHome: "回到首頁"
_en:
  articleNotFound: "Article not found"
  goHome: "Go home"
</i18n>

<template>
<div class="error">
  <h1>{{ error.statusCode }}</h1>
  <h2>{{ $t(error.message) }}</h2>
  <div class="actions">
    <nuxt-link :to="localePath('/')">{{ $t('goHome') }}</nuxt-link>
  </div>
</div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="scss">
.error {
  margin: 1rem;
  > .actions {
    margin-top: 1rem;
  }
}
</style>
