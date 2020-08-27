<i18n lang="yaml">
tw:
  description: "IORG 於 2019 年成立，由新聞媒體工作者、社會科學家、資料科學家、社會運動者組成，目的是在認知戰的框架下紀錄、研究、理解資訊操弄。"
  intro: "針對資訊操弄、資訊戰的研究，必須跨領域、資料驅動而嚴謹，方能確實了解認知戰，並適當回應，以捍衛自由、強化台灣民主。"
en:
  description: "IORG is a Taiwan-based multidisciplinary research group formed in 2019 by media workers, social scientists, data scientists, and local activist. IORG researches information manipulation within the framework of cognitive warfare."
  intro: "A multidisciplinary, data-driven, rigorous understanding of information operation & manipulation is needed in order to devise appropriate responses to respond to cognitive warfare, protect Taiwan’s civil liberties, and strengthen Taiwan’s democracy."
</i18n>

<template>
<div class="page index">
  <section class="reports">
    <div class="container">
      <div v-for="report of reports" :key="report.title" class="panel report">
        <a class="cover block" :href="report.url"><img :src="report.image" /></a>
        <h2>{{ report.title }}</h2>
        <div v-for="(action, actionIndex) of report.actions" :key="action.label" class="action" :class="actionIndex < 1 ? ['primary'] : []">
          <a :href="action.url" class="block">{{ action.label }}</a>
        </div>
      </div>
    </div>
  </section>
  <section class="text description">
    <p v-html="$t('description')"></p>
  </section>
  <section class="text intro">
    <p>{{ $t('intro') }}</p>
  </section>
</div>
</template>

<script>
import config from '~/data/config.js'
import home from '~/data/home.js'

export default {
  data() {
    return Object.assign({}, config, home)
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

section {
  &.reports {
    .action {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0.5rem 0 0;
      & > a {
        color: var(--iorg-text);
        padding: 0.25rem 0.5rem;
        cursor: pointer;
      }
      &.primary > a {
        background-color: var(--iorg-primary-dark-color);
        color: var(--iorg-primary-light-color);
        line-height: 1;
        padding: 0.75rem 1rem;
        border-radius: 1.25rem;
      }
    }
  }
  &.description {
    padding: 2.5rem;
    background-color: var(--iorg-primary-dark-color);
    font-size: 2.25rem;
    color: var(--iorg-primary-light-color);
  }
  &.intro {
    padding: 2rem 1.5rem 0;
    font-size: 1.125rem;
    line-height: 1.375;
  }
  &.text {
    > p {
      max-width: 40rem;
    }
  }
}
.section-header {
  margin: 2rem 1.5rem 0;
  font-size: 1.125rem;
  font-weight: bold;
  > span {
    border-bottom: 2px solid var(--iorg-text);
  }
}
.section-intro {
  margin: 2rem 1.5rem 0;
  font-size: 1.125rem;
  font-weight: bold;
}
.container {
  display: flex;
  flex-wrap: wrap;
  margin: 0.5rem;
  max-width: 60rem;
  > .panel {
    max-width: 20rem;
    margin: 1rem;
  }
}
.section-header + .container {
  margin-top: 0;
}
.report {
  margin: 2rem;
  > h2 {
    margin: 0.5rem 0.125rem 0;
    font-family: serif;
    font-size: 1rem;
    font-weight: normal;
    font-style: italic;
  }
  > .cover {
    display: block;
    width: 100%;
    > img {
      width: 100%;
    }
    border-radius: 0.25rem;
    overflow: hidden;
    background-color: white;
    @include shadow;
  }
}
</style>
