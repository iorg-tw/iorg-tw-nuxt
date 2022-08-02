<i18n lang="yaml">
_tw:
  evals: "評量"
_en:
  evals: "Evaluations"
</i18n>

<template>
<div class="page eval-index">
  <div class="title-doc google-doc as-page">
    <div class="title">
      <h1>{{ doc.title }}</h1>
      <p class="subtitle">{{ doc.subtitle }}</p>
    </div>
  </div>
  <google-doc :doc="doc" :options="{ metaphor: 'page', head: false }" class="doc-eval" />
  <div class="section-header">
    <p class="section-title-fancy">{{ $t('evals') }}</p>
  </div>
  <article-list type="eval" />
</div>
</template>

<script>
import { getLocalizedArticles } from '~/lib/i18n'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'
import ArticleList from '~/components/ArticleList'

const EVAL = 'eval'

export default {
  components: {
    GoogleDoc,
    ArticleList
  },
  async asyncData({ app }) {
    const [doc] = await getLocalizedArticles(['_' + EVAL], app.i18n.locale)
    return {
      doc
    }
  },
  head() {
    return generateMeta(this.doc.title)
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.eval-index {
  padding: $default-page-padding;
}

</style>
