<template>
<div class="page research">
  <div class="section-header">
    <h1>{{ doc.title }}</h1>
  </div>
  <div v-for="objL0 of structuredDoc" :key="objL0.title" class="group">
    <google-doc :doc="objL0" :options="{ metaphor: 'page' }" />
    <div class="findings">
      <div v-for="objL1 of objL0.children" :key="objL1.title" class="finding">
        <google-doc :doc="objL1" :options="{ metaphor: 'page', enableToggle: true }" />
      </div>
    </div>
  </div>
  <node-list :nodes="nodes" />
</div>
</template>

<script>
import tree from '~/data/research-tree'
import { getDoc, structureDoc } from '~/lib/gdoc'
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
    const structuredDoc = structureDoc(doc.html, ['h2', 'h3'])
    return {
      doc,
      structuredDoc
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
  > .section-header {
    margin-bottom: 0.5rem;
  }
  > .group {
    > .findings {
      margin-bottom: 1.5rem;
    }
  }
}
</style>
