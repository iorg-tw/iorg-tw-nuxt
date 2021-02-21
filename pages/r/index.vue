<i18n lang="yaml">
_tw:
  title: "極權擴張與民主防衛"
  subtitle: "IORG 中國對台滲透跨領域研究"
  directory: "目錄"
  about: "關於 IORG"
  more: "完整內容"
_en:
  title: "Defending Democracy Against Authoritarian Expansion"
  subtitle: "IORG Research on Chinese Infiltration Against Taiwan"
  directory: "Directory"
  about: "About IORG"
  more: "More"
</i18n>

<template>
<div class="page research">
  <div class="page-header section-header">
    <h1>{{ $t('title') }}</h1>
    <p class="subtitle">{{ $t('subtitle') }}</p>
  </div>
  <div class="key-findings">
    <div v-for="objL0 of structuredDocK" :key="objL0.title" class="group">
      <div class="group-header section-header ">
        <div :is="objL0.titleTag">{{ objL0.title }}</div>
        <nuxt-link to="/r/k" class="more button small">{{ $t('more') }}</nuxt-link>
      </div>
      <div v-if="objL0.children" class="findings container">
        <div v-for="objL1 of objL0.children" :key="objL1.title" class="finding panel filled tiled">
          <div :is="objL1.titleTag" class="header detail">{{ objL1.title }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="section-header">
    <h2>{{ $t('directory') }}</h2>
  </div>
  <node-list :nodes="level0Nodes" :options="{ tiled: true }" />
  <intro k="default" :more="docAck.html" />
</div>
</template>

<script>
import { articleMap, tree, defaultCover } from '~/data/research'
import { getDoc, structureDoc } from '~/lib/gdoc'
import NodeList from '~/components/NodeList'
import Intro from '~/components/Intro'

export default {
  components: {
    NodeList,
    Intro
  },
  async asyncData() {
    const [docK, docAck] = await Promise.all([
      getDoc(articleMap.keyFindings.publicURL),
      getDoc(articleMap.acknowledgement.publicURL)
    ])
    const structuredDocK = structureDoc(docK.html, ['h2', 'h3'])

    const level0Nodes = tree.filter(node => node.level === 0)

    return {
      structuredDocK,
      docAck,
      level0Nodes,
      defaultCover
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.research {
  > .page-header {
    .subtitle {
      font-size: 1.25rem;
      font-weight: bold;
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
