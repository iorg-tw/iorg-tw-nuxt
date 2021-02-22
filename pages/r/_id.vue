<template>
<div class="page research">
  <google-doc :doc="doc" :options="{ showSummary: false }" />
</div>
</template>

<script>
import researchDocMap from '~/data/research-docs'
import tree from '~/data/research-tree'
import { getDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

export default {
  components: {
    GoogleDoc
  },
  async asyncData({ params, error }) {
    const id = params.id
    const to = '/r/' + id
    const matchingNodes = tree.filter(node => node.to === to && node.isArticle && researchDocMap[node.id] && researchDocMap[node.id].publicURLs._tw)
    if(matchingNodes.length < 1) {
      error({ statusCode: 404, message: 'pageNotFound' })
      return
    }
    const node = matchingNodes[0]
    const doc = await getDoc(researchDocMap[node.id].publicURLs._tw)
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

.page.research {
  padding: $default-page-padding;
}
</style>
