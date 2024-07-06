<i18n lang="yaml">
_tw:
  bunkhoo: "文庫"
  da: "週報"
  eval: "可信度評量"
  article: "報導"
_en:
  bunkhoo: "Bunkhoo"
  da: "Reports"
  eval: "Cred Evals"
  article: "Articles"
</i18n>

<template>
<div class="page articles">
  <section class="content-list">
    <div class="section-header">
      <p class="section-title">{{ $t('da') }}</p>
    </div>
    <article-list type="da" features="show-filter" />
  </section>
  <section class="content-list">
    <div class="section-header">
      <p class="section-title">{{ $t('eval') }}</p>
    </div>
    <article-list type="eval" />
  </section>
  <section class="content-list">
    <div class="section-header">
      <p class="section-title">{{ $t('article') }}</p>
    </div>
    <article-list features="show-filter" />
  </section>
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
