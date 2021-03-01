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
    <div v-for="objL0 of localizedStructuredDocK" :key="objL0.title" class="group">
      <div class="group-header section-header">
        <div :is="objL0.titleTag" class="group-title">{{ objL0.title }}</div>
        <nuxt-link :to="localePath('/r/k')" class="more button small">{{ $t('more') }}</nuxt-link>
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
  <intro k="iorg_about" :more="localizedDocAck.html" />
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
    /* eslint-disable camelcase */
    const [docK_tw, docK_en, docAck_tw, docAck_en] = await Promise.all([
      getDoc(articleMap._R_K.publicURLs._tw),
      getDoc(articleMap._R_K.publicURLs._en),
      getDoc(articleMap.ack.publicURLs._tw),
      getDoc(articleMap.ack.publicURLs._en)
    ])

    return {
      structuredDocK: {
        _tw: structureDoc(docK_tw.html, ['h2', 'h3']),
        _en: structureDoc(docK_en.html, ['h2', 'h3'])
      },
      docAck: {
        _tw: docAck_tw,
        _en: docAck_en
      },
      level0Nodes: tree.filter(node => node.level === 0)
    }
  },
  computed: {
    localizedStructuredDocK() {
      return this.structuredDocK[this.$i18n.locale]
    },
    localizedDocAck() {
      return this.docAck[this.$i18n.locale]
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
