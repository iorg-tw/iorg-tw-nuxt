<i18n lang="yaml">
_tw:
  title: "極權擴張與民主防衛"
  subtitle: "IORG 中國對台滲透跨領域研究"
  reports: "各項報告"
  about: "關於 IORG"
  more: "完整內容"
_en:
  title: "Defending Democracy Against Authoritarian Expansion"
  subtitle: "IORG Research on Chinese Infiltration Against Taiwan"
  reports: "Reports"
  about: "About IORG"
  more: "More"
</i18n>

<template>
<div class="page report-home">
  <div class="section-header">
    <h1>{{ $t('title') }}</h1>
    <p class="subtitle">{{ $t('subtitle') }}</p>
  </div>
  <div class="key-findings">
    <div v-for="objL0 of structuredDocK" :key="objL0.title" class="group">
      <div class="group-header section-header ">
        <div :is="objL0.titleTag">{{ objL0.title }}</div>
        <nuxt-link to="/r/k" class="more button">{{ $t('more') }}</nuxt-link>
      </div>
      <div v-if="objL0.children" class="findings container">
        <div v-for="objL1 of objL0.children" :key="objL1.title" class="finding panel filled tiled">
          <div :is="objL1.titleTag" class="header detail">{{ objL1.title }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="section-header">
    <h2>{{ $t('reports') }}</h2>
  </div>
  <div class="topics container">
    <div v-for="topic of topics" :key="topic.id" class="topic panel tiled">
      <img class="cover" :src="topic.image" />
      <div class="detail">
        <p>{{ topic.id }}</p>
        <h3><nuxt-link :to="localePath(topic.to)">{{ topic.title }}</nuxt-link></h3>
      </div>
    </div>
  </div>
  <intro k="default" :more="docAck.html" />
</div>
</template>

<script>
import { articleMap, topics } from '~/data/research'
import { getDoc, structureDoc } from '~/lib/gdoc'
import Intro from '~/components/Intro'

export default {
  components: {
    Intro
  },
  async asyncData() {
    const docK = await getDoc(articleMap.keyFindings.publicURL)
    const structuredDocK = structureDoc(docK.html, ['h2', 'h3'])

    const docAck = await getDoc(articleMap.acknowledgement.publicURL)

    return {
      structuredDocK,
      topics,
      docAck
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.report-home {
  .subtitle {
    font-size: 1.25rem;
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
  > .topics {
    > .topic {
      position: relative;
      display: flex;
      align-items: flex-start;
      > .cover {
        width: 120px;
        border-radius: 0.5rem;
        @include shadow;
      }
      > .detail {
        padding: 0;
        padding-left: 0.75rem;
      }
    }
  }
}
</style>
