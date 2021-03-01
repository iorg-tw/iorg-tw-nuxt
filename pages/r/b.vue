<template>
<div class="page research-b">
  <div class="title-doc google-doc as-page">
    <div class="title">
      <h1>{{ doc.title }}</h1>
    </div>
  </div>
  <google-doc :doc="doc" :options="{ metaphor: 'page', head: false }" class="doc-b-comp" />
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
  id: '_R_B',
  code: 'B'
}

export default {
  components: {
    GoogleDoc,
    NodeList
  },
  async asyncData() {
    const url = 'https://docs.google.com/document/d/e/2PACX-1vRD5hKG24sAbqGn5enX-tHf5Cfh3Uv9BKaSBdyMdb7rrLWrSVBrrq2sfgxEbyx-4tIg9AkAghZDqrtD/pub'
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

.page.research-b {
  padding: $default-page-padding;
  .section-header {
    margin-bottom: 0.5rem;
  }
}
</style>
