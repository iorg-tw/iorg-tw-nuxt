<template>
<div class="page research">
  <div class="section-header">
    <h1>{{ doc.title }}</h1>
  </div>
  <google-doc :doc="doc" :options="{ metaphor: 'page', head: false }" class="doc-d" />
  <node-list :nodes="nodes" />
</div>
</template>

<script>
import tree from '~/data/research-tree'
import { getDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'
import NodeList from '~/components/NodeList'

const CONST = {
  id: '_R_D',
  code: 'D'
}

export default {
  components: {
    GoogleDoc,
    NodeList
  },
  async asyncData() {
    const url = 'https://docs.google.com/document/d/e/2PACX-1vRpuzArr1SgHaSd-sErL_0dM2Fj4fESvM8WMplzhz9nQPaTI57bf7nM4lNWbDvsVkdrKuwXHbn87s2t/pub'
    const doc = await getDoc(url)
    return {
      doc
    }
  },
  data() {
    const nodes = tree.filter(node => node.parentID === CONST.id)
    return {
      nodes,
      CONST
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
