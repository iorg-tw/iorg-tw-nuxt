<template>
<div class="page research">
  <google-doc :doc="doc" :options="{ showSummary: false }" />
</div>
</template>

<script>
import { articleMap } from '~/data/research'
import { getDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

export default {
  components: {
    GoogleDoc
  },
  async asyncData() {
    const doc = await getDoc(articleMap.keyFindings.publicURL)
    return {
      doc
    }
  },
  head() {
    return generateMeta(this.doc.title, this.doc.subtitle, this.doc.summary, this.doc.coverImage)
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.research-key-findings {
  padding: $default-page-padding;
}
</style>
