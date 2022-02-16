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
<div class="page research-home">
  <div class="page-header section-header">
    <h1>{{ $t('research_title_1') }}</h1>
    <p class="subtitle">{{ $t('research_title_2') }}</p>
  </div>
  <div class="key-findings">
    <div v-for="objL0 of structuredDocK" :key="objL0.title" class="group">
      <div class="group-header section-header">
        <div :is="objL0.titleTag" class="group-title">{{ objL0.title }}</div>
        <nuxt-link :to="localePath('/r/k')" class="more button small">{{ $t('more') }}</nuxt-link>
      </div>
      <div v-if="objL0.children" class="findings container">
        <div v-for="objL1 of objL0.children" :key="objL1.title" class="finding panel tiled large filled raised">
          <p class="header detail">{{ objL1.title }}</p>
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
import tree from '~/data/research-tree'
import { getLocalizedArticles } from '~/lib/i18n'
import { structureDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import NodeList from '~/components/NodeList'
import Intro from '~/components/Intro'

export default {
  components: {
    NodeList,
    Intro
  },
  async asyncData({ app }) {
    const [docK, docAck] = await getLocalizedArticles(['_R_K', '_ack'], app.i18n.locale, app.i18n.defaultLocale)
    return {
      structuredDocK: structureDoc(docK.html, ['h2', 'h3']),
      docAck,
      level0Nodes: tree.filter(node => node.level === 0)
    }
  },
  head() {
    return generateMeta(this.$t('research_title_2'))
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.research-home {
  > .page-header {
    .subtitle {
      margin-top: 0.25rem;
      font-size: 1.25rem;
      color: var(--iorg-accent);
    }
  }
  > .key-findings {
    > .group {
      > .group-header {
        > .group-title {
          display: inline;
          vertical-align: middle;
        }
        > .more {
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
