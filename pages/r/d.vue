<template>
<div class="page research-d">
  <div class="title-doc google-doc as-page">
    <div class="title">
      <h1>{{ doc.title }}</h1>
      <p class="subtitle">{{ doc.subtitle }}</p>
    </div>
  </div>
  <div v-for="(objL0, indexL0) of structuredDoc" :key="objL0.title" class="group">
    <google-doc :doc="objL0" :options="{ metaphor: 'page' }" />
    <div class="findings">
      <google-doc v-for="objL1 of objL0.children" :key="objL1.title" :doc="objL1" :options="{ enableToggle: true }" class="finding" />
    </div>
    <!-- FIXME: this 👇 is cheating -->
    <div v-if="indexL0 === 0" class="tree">
      <node-list :nodes="nodes" />
    </div>
  </div>
</div>
</template>

<script>
import tree from '~/data/tree'
import { getLocalizedArticles } from '~/lib/i18n'
import { structureDoc } from '~/lib/gdoc'
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
  async asyncData({ app }) {
    const [doc] = await getLocalizedArticles([CONST.id], app.i18n.locale, app.i18n.defaultLocale)
    const structuredDoc = structureDoc(doc.html, ['h2', 'h3'])
    const nodes = tree.filter(node => node.parent === CONST.id)
    return {
      doc,
      structuredDoc,
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

.page.research-d {
  padding: $default-page-padding;
  > .section-header {
    margin-bottom: 0.5rem;
  }
  > .group {
    > .findings {
      margin-bottom: 1.5rem;
      > .finding { // FIXME: this is cheating
        margin-right: 0;
        margin-left: 0;
        margin-bottom: 0.5rem;
        @media (min-width: 768px) {
          margin-right: 1.5rem;
          margin-left: 1.5rem;
        }
      }
    }
  }
}
</style>
