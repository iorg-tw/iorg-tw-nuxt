<i18n lang="yaml">
_tw:
  key_research_conclusions: "總體研究成果"
  resources: "資源"
  directory: "目錄"
  about: "關於 IORG"
  more: "完整內容"
_en:
  key_research_conclusions: "Key Research Conclusions"
  resources: "Resources"
  directory: "Directory"
  about: "About IORG"
  more: "More"
</i18n>

<template>
<div class="page research-home">
  <div class="page-header section-header">
    <h1>{{ $t('r_title_2023') }}</h1>
    <p class="subtitle">{{ $t('r_subtitle_2023') }}</p>
  </div>
  <div class="key-findings">
    <div v-for="objL0 of structuredDocK2023" :key="objL0.title" class="group">
      <div class="group-header section-header">
        <div :is="objL0.titleTag" class="group-title">{{ objL0.title }}</div>
        <nuxt-link :to="localePath('/r/2023')" class="more button small">{{ $t('more') }}</nuxt-link>
      </div>
      <div v-if="objL0.children" class="findings container">
        <div v-for="objL1 of objL0.children" :key="objL1.title" class="finding panel tiled large filled raised">
          <p class="header detail">{{ objL1.title }}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="divider"></div>
  <div class="page-header section-header">
    <h1>{{ $t('r_title_2022') }}</h1>
    <p class="subtitle">{{ $t('r_subtitle_2022') }}</p>
  </div>
  <div class="key-findings">
    <div v-for="objL0 of structuredDocK2022" :key="objL0.title" class="group">
      <div class="group-header section-header">
        <div :is="objL0.titleTag" class="group-title">{{ objL0.title }}</div>
        <nuxt-link :to="localePath('/r/2022')" class="more button small">{{ $t('more') }}</nuxt-link>
      </div>
      <div v-if="objL0.children" class="findings container">
        <div v-for="objL1 of objL0.children" :key="objL1.title" class="finding panel tiled large filled raised">
          <p class="header detail">{{ objL1.title }}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="divider"></div>
  <div class="page-header section-header">
    <h1>{{ $t('r_title_2021') }}</h1>
    <p class="subtitle">{{ $t('r_subtitle_2021') }}</p>
  </div>
  <div class="key-findings">
    <div v-for="objL0 of structuredDocK2021" :key="objL0.title" class="group">
      <div class="group-header section-header">
        <div :is="objL0.titleTag" class="group-title">{{ objL0.title }}</div>
        <nuxt-link :to="localePath('/r/2021')" class="more button small">{{ $t('more') }}</nuxt-link>
      </div>
      <div v-if="objL0.children" class="findings container">
        <div v-for="objL1 of objL0.children" :key="objL1.title" class="finding panel tiled large filled raised">
          <p class="header detail">{{ objL1.title }}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="divider"></div>
  <div class="section-header">
    <h2>{{ $t('resources') }}</h2>
  </div>
  <node-list :nodes="level0NodesSys" :options="{ tiled: true }" />
  <div class="divider"></div>
  <div class="page-header section-header">
    <h1>{{ $t('r_title_1') }}</h1>
    <p class="subtitle">{{ $t('r_title_2') }}</p>
  </div>
  <div class="key-findings">
    <div v-for="objL0 of structuredDocK2020" :key="objL0.title" class="group">
      <div class="group-header section-header">
        <div :is="objL0.titleTag" class="group-title">{{ objL0.title }}</div>
        <nuxt-link :to="localePath('/r/2020')" class="more button small">{{ $t('more') }}</nuxt-link>
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
  <node-list :nodes="level0Nodes2020" :options="{ tiled: true }" />
  <intro k="iorg_about" :more="docAck.html" />
</div>
</template>

<script>
import tree from '~/data/tree'
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
    const [docK2020, docK2021, docK2022, docK2023, docAck] = await getLocalizedArticles(['_R_2020', '_R_2021', '_R_2022', '_R_2023', '_ack'], app.i18n.locale)
    return {
      structuredDocK2020: structureDoc(docK2020.html, ['h2', 'h3']),
      level0Nodes2020: tree.filter(node => node.group === 2020 && node.level === 0),
      structuredDocK2021: structureDoc(docK2021.html, ['h2', 'h3']),
      level0Nodes2021: tree.filter(node => node.group === 2021 && node.level === 0),
      structuredDocK2022: structureDoc(docK2022.html, ['h2', 'h3']),
      level0Nodes2022: tree.filter(node => node.group === 2022 && node.level === 0),
      structuredDocK2023: structureDoc(docK2023.html, ['h2', 'h3']),
      level0Nodes2023: tree.filter(node => node.group === 2023 && node.level === 0),
      level0NodesSys: tree.filter(node => node.group === 0 && node.level === 0),
      docAck
    }
  },
  head() {
    return generateMeta(this.$t('key_research_conclusions'))
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
