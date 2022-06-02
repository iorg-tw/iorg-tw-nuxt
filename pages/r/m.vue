<template>
<div class="page research-m">
  <google-doc :doc="doc" :options="{ showSummary: false }" />
</div>
</template>

<script>
import { getLocalizedArticles } from '~/lib/i18n'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

export default {
  components: {
    GoogleDoc
  },
  async asyncData({ app }) {
    const [doc] = await getLocalizedArticles(['_R_M'], app.i18n.locale)
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

.page.research-m {
  padding: $default-page-padding;
}
</style>
