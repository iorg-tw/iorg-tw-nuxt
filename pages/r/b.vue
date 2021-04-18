<template>
<div class="page research-b">
  <div class="title-doc google-doc as-page">
    <div class="title">
      <h1>{{ doc.title }}</h1>
      <p class="subtitle">{{ doc.subtitle }}</p>
    </div>
  </div>
  <google-doc :doc="doc" :options="{ metaphor: 'page', head: false }" class="doc-b-comp" />
  <node-list :nodes="nodes" />
</div>
</template>

<script>
import tree from '~/data/research-tree'
import { getLocalizedArticles } from '~/lib/i18n'
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
  async asyncData({ app }) {
    const [doc] = await getLocalizedArticles([CONST.id], app.i18n.locale, app.i18n.defaultLocale)
    const nodes = tree.filter(node => node.parentID === CONST.id)
    return {
      doc,
      nodes
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
