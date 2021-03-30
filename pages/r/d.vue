<template>
<div class="page research-d">
  <div class="title-doc google-doc as-page">
    <div class="title">
      <h1>{{ localizedDoc.title }}</h1>
      <p class="subtitle">{{ localizedDoc.subtitle }}</p>
    </div>
  </div>
  <div v-for="(objL0, indexL0) of localizedStructuredDoc" :key="objL0.title" class="group">
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
import articleMap from '~/data/articles'
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
    const docURLs = [
      articleMap[CONST.id].publicURLs._tw,
      articleMap[CONST.id].publicURLs._en
    ] // 0 = _tw; 1 = _en
    const docs = await Promise.all(docURLs.map(url => getDoc(url)))
    return {
      localizedDocs: {
        _tw: docs[0],
        _en: docs[1]
      },
      localizedStructuredDocs: {
        _tw: structureDoc(docs[0].html, ['h2', 'h3']),
        _en: structureDoc(docs[1].html, ['h2', 'h3'])
      }
    }
  },
  data() {
    const nodes = tree.filter(node => node.parentID === CONST.id)
    return {
      nodes,
      CONST
    }
  },
  computed: {
    localizedDoc() {
      return this.localizedDocs[this.$i18n.locale]
    },
    localizedStructuredDoc() {
      return this.localizedStructuredDocs[this.$i18n.locale]
    }
  },
  head() {
    return generateMeta(this.localizedDoc.title)
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
