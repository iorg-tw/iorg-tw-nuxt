<template>
<div class="page open">
  <google-doc :doc="doc" :options="{ showSummary: false }" />
</div>
</template>

<script>
import articleMap from '~/data/articles'
import { getDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

export default {
  components: {
    GoogleDoc
  },
  async asyncData() {
    const doc = await getDoc(articleMap._O.publicURLs._tw)
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

.page.open {
  padding: $default-page-padding;
}
</style>
