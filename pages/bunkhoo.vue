<i18n lang="yaml">
_tw:
  bunkhoo: "文庫"
_en:
  bunkhoo: "Bunkhoo"
</i18n>

<template>
<div class="page articles">
  <article-list :show-all="true" />
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
    return generateMeta(this.$t('bunkhoo'))
  }
}
</script>
