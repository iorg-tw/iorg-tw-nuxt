<i18n lang="yaml">
tw:
  title: "極權擴張"
  subtitle: "中國對台滲透"
  keyFindings: "研究總結"
  reports: "各項報告"
  tagline: "IORG 是以公開資訊、科學方法、在地連結，反制極權擴張的台灣跨領域研究團隊。"
  about: "關於我們"
  articles: "報導"
  videos: "影音"
en:
  title: "Authoritarian Expansion"
  subtitle: "Chinese Infiltration Against Taiwan"
  keyFindings: "Key Findings"
  reports: "Reports"
  tagline: "IORG is a Taiwan-based multidisciplinary research group countering authoritarian expansion with public information, scientific methodologies, and grassroots organization."
  about: "About us"
  articles: "Articles"
  videos: "Videos"
</i18n>

<template>
<div class="page">
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
  <div class="intro">
    <div class="content">
      <div class="tagline">{{ $t('tagline') }}</div>
      <div class="about">
        <nuxt-link to="/about" class="inverted">{{ $t('about') }}</nuxt-link>
      </div>
      <div class="acknowledgement" v-html="docAck.html"></div>
    </div>
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
@import '~assets/styles/resources';

.page {
  > .section-header {
    margin-top: 2rem;
    margin-left: 0.75rem + 0.625rem;
    margin-right: 0.75rem + 0.625rem;
    overflow: hidden;
  }
  > .findings {
    > .finding {
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
  > .intro {
    margin: 2rem 0 0;
    padding: 2rem;
    background-color: var(--iorg-primary-dark-color);
    color: var(--iorg-primary-light-color);
    > .content {
      max-width: 30rem;
      > .tagline {
        font-size: 2rem;
      }
      > .about {
        margin: 1rem 0;
      }
      > .acknowledgement {
        color: #aaa;
        p {
          line-height: $line-height-default;
          &:not(:last-of-type) {
            margin-bottom: 1.375rem;
          }
        }
      }
    }
  }
}
</style>
