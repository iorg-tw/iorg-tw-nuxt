<i18n lang="yaml">
tw:
  title: "極權擴張"
  subtitle: "中國對台滲透綜合研究"
  keyFindings: "研究總結"
  reports: "各項報告"
  about: "關於 IORG"
  articles: "報導"
  videos: "影音"
en:
  title: "Authoritarian Expansion"
  subtitle: "Chinese Infiltration Against Taiwan"
  keyFindings: "Key Findings"
  reports: "Reports"
  about: "About IORG"
  articles: "Articles"
  videos: "Videos"
</i18n>

<template>
<div class="page report-home">
  <div class="section-header">
    <h1>{{ $t('title') }}</h1>
    <h2>{{ $t('subtitle') }}</h2>
    <h2>{{ $t('keyFindings') }}</h2>
  </div>
  <div class="findings container">
    <div v-for="(finding, findingIndex) of findings" :key="findingIndex" class="finding panel filled tiled">
      <div class="header detail" v-html="finding.header"></div>
      <div class="body detail" v-html="finding.body"></div>
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
        <h3><nuxt-link :to="topic.to">{{ topic.title }}</nuxt-link></h3>
      </div>
    </div>
  </div>
  <intro k="default" :more="docAck.html" />
</div>
</template>

<script>
import { articleMap, topics } from '~/data/research'
import { getDoc, toSectionArray } from '~/lib/gdoc'
import Intro from '~/components/Intro'

export default {
  components: {
    Intro
  },
  async asyncData() {
    const docK = await getDoc(articleMap.keyFindings.publicURL)
    const findings = toSectionArray(docK.html, 'h3')

    const docAck = await getDoc(articleMap.acknowledgement.publicURL)

    return {
      findings,
      topics,
      docAck
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.report-home {
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
