<template>
<div class="page research-b">
  <div class="title-doc google-doc as-page">
    <div class="title">
      <h1>{{ localizedDoc.title }}</h1>
      <p class="subtitle">{{ localizedDoc.subtitle }}</p>
    </div>
  </div>
  <google-doc :doc="localizedDoc" :options="{ metaphor: 'page', head: false }" class="doc-b-comp" />
  <node-list :nodes="nodes" />
</div>
</template>

<script>
import articleMap from '~/data/articles'
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
    const docURLs = [
      articleMap[CONST.id].publicURLs._tw,
      articleMap[CONST.id].publicURLs._en
    ] // 0 = _tw; 1 = _en
    const docs = await Promise.all(docURLs.map(url => getDoc(url)))
    return {
      localizedDocs: {
        _tw: docs[0],
        _en: docs[1]
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
    }
  },
  head() {
    return generateMeta(this.localizedDoc.title)
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
