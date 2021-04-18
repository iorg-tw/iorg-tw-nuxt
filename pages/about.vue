<template>
<div class="page about">
  <google-doc :doc="doc" />
</div>
</template>

<script>
import { getLocalizedArticles } from '~/lib/i18n'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

const ID = 'about'

export default {
  components: {
    GoogleDoc
  },
  async asyncData({ app }) {
    const [doc] = await getLocalizedArticles([ID], app.i18n.locale, app.i18n.defaultLocale)
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

.page.about {
  padding: $default-page-padding;
}
</style>
