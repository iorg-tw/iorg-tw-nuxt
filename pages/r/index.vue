<i18n lang="yaml">
tw:
  reportTitle: "中國對台滲透研究報告"
  keyFindings: "研究總結"
en:
  reportTitle: "Report on Chinese Infiltration Against Taiwan"
  keyFindings: "Key Findings"
</i18n>

<template>
<div class="page">
  <div class="container">
    <div class="panel text">
      <h1>{{ $t('reportTitle') }}</h1>
      <h2>{{ $t('keyFindings') }}</h2>
    </div>
  </div>
  <div class="findings container">
    <div v-for="(finding, findingIndex) of findings" :key="findingIndex" class="finding panel filled tiled">
      <div class="header detail" v-html="finding.header"></div>
      <div class="body detail" v-html="finding.body"></div>
    </div>
  </div>
  <div class="topics container">
    <div v-for="topic of topics" :key="topic.id" class="topic panel tiled compact">
      <nuxt-link :to="topic.to">{{ topic.id }} {{ topic.title }}</nuxt-link>
    </div>
  </div>
  <div class="acknowledgement container">
    <div class="content panel text" v-html="docAck.html"></div>
  </div>
</div>
</template>

<script>
import { articleMap, topics } from '~/data/report'
import { getDoc, toSectionArray } from '~/lib/gdoc'

export default {
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
.page {
  > .findings {
    > .finding {
    }
  }
  > .topics {
    > .topic {
    }
  }
}
</style>
