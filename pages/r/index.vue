<i18n lang="yaml">
_tw:
  directory: "目錄"
  about: "關於 IORG"
  more: "完整內容"
_en:
  directory: "Directory"
  about: "About IORG"
  more: "More"
</i18n>

<template>
<div class="page research">
  <div class="page-header section-header">
    <h1>{{ $t('research_title_1') }}</h1>
    <p class="subtitle">{{ $t('research_title_2') }}</p>
  </div>
  <div class="key-findings">
    <div v-for="objL0 of structuredDocK" :key="objL0.title" class="group">
      <div class="group-header section-header">
        <div :is="objL0.titleTag">{{ objL0.title }}</div>
        <nuxt-link to="/r/k" class="more button small">{{ $t('more') }}</nuxt-link>
      </div>
      <div v-if="objL0.children" class="findings container">
        <div v-for="objL1 of objL0.children" :key="objL1.title" class="finding panel tiled large filled raised">
          <div :is="objL1.titleTag" class="header detail">{{ objL1.title }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="section-header">
    <h2>{{ $t('directory') }}</h2>
  </div>
  <node-list :nodes="level0Nodes" :options="{ tiled: true }" />
  <intro k="iorg_about" :more="docAck.html" />
</div>
</template>

<script>
import articleMap from '~/data/articles'
import tree from '~/data/research-tree'
import { getDoc, structureDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import NodeList from '~/components/NodeList'
import Intro from '~/components/Intro'

export default {
  components: {
    NodeList,
    Intro
  },
  async asyncData() {
    const [docK, docAck] = await Promise.all([
      getDoc(articleMap._R_K.publicURLs._tw),
      getDoc(articleMap.ack.publicURLs._tw)
    ])
    const structuredDocK = structureDoc(docK.html, ['h2', 'h3'])

    const level0Nodes = tree.filter(node => node.level === 0)

    return {
      structuredDocK,
      docAck,
      level0Nodes
    }
  },
  head() {
    return generateMeta(this.$t('research_title_2'))
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.research {
  > .page-header {
    h1 {
      font-size: 2.25rem;
    }
    .subtitle {
      font-size: 1.375rem;
      color: var(--iorg-accent);
    }
  }
  > .key-findings {
    .group-header {
      display: flex;
      align-items: center;
    }
    .more {
      margin: 0 0.25rem;
    }
  }
}
</style>
