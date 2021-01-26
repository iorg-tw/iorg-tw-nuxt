<template>
<div class="page">
  <div class="key-findings">
    <h2>Key findings</h2>
    <div class="findings" v-html="docK.html"></div>
  </div>
  <div class="sections">
    <div v-for="section of sections" :key="section.id" class="section">{{ section.id }} {{ section.title }}</div>
  </div>
</div>
</template>

<script>
import { articleMap, sections } from '~/data/report'
import { getDoc } from '~/lib/gdoc'

export default {
  async asyncData() {
    const docK = await getDoc(articleMap.keyFindings.publicURL)
    return {
      docK,
      sections
    }
  }
}
</script>

<style lang="scss">
.page {
  > .key-findings {
    > .findings {
      > div {
        display: flex;
        flex-wrap: wrap;
        p {
          width: 50%;
          font-size: 1.25rem;
        }
      }
    }
  }
  > .sections {
    display: flex;
    flex-wrap: wrap;
    > .section {
      width: 25%;
    }
  }
}
</style>
