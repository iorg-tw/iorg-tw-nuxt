<template>
<div class="page research">
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
    const doc = await getDoc(articleMap._R_K.publicURLs._tw)
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

.page.research {
  padding: $default-page-padding;
}
</style>
