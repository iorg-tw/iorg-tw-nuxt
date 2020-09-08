<i18n lang="yaml">
tw:
  description: "IORG 於 2019 年成立，由新聞媒體工作者、社會科學家、資料科學家、社會運動者組成，目的在於紀錄、研究、理解資訊操弄、加強資訊判讀，以應對認知戰。"
  intro: "針對資訊操弄、資訊戰的研究，必須跨領域、資料驅動而嚴謹，方能確實了解認知戰，並適當回應，以捍衛自由、強化台灣民主。"
  articles: "資訊操弄相關報導"
  videos: "影片"
en:
  description: "IORG is a Taiwan-based multidisciplinary research group formed in 2019 by media workers, social scientists, data scientists, and local activists. IORG researches information manipulation and strengthens information literacy in response to cognitive warfare."
  intro: "A multidisciplinary, data-driven, rigorous understanding of information operation & manipulation is needed in order to devise appropriate responses to respond to cognitive warfare, protect Taiwan’s civil liberties, and strengthen Taiwan’s democracy."
  articles: "Articles"
  videos: "Videos"
</i18n>

<template>
<div class="page index">
  <section id="r" class="reports">
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
  <section class="description">
    <div class="container">
      <div class="panel text">
        <p v-html="$t('description')"></p>
      </div>
    </div>
  </section>
  <section id="a" class="content-list articles">
    <div class="container">
      <div class="panel text">
        <p class="section-title">{{ $t('articles') }}</p>
      </div>
    </div>
    <article-list type="article" />
  </section>
  <section id="v" class="content-list videos">
    <div class="container">
      <div class="panel text">
        <p class="section-title">{{ $t('videos') }}</p>
      </div>
    </div>
    <article-list type="video" />
  </section>
</div>
</template>

<script>
import config from '~/data/config.js'
import home from '~/data/home.js'
import allArticles from '~/data/articles.json'
import ArticleList from '~/components/ArticleList'

const keys = Object.keys(allArticles)
const articleKeys = keys.filter(id => allArticles[id].type === 'article' && allArticles[id].published)
const videoKeys = keys.filter(id => allArticles[id].type === 'video' && allArticles[id].published)

const articles = Object.assign({}, ...articleKeys.map(id => ({ [id]: allArticles[id] })))
const videos = Object.assign({}, ...videoKeys.map(id => ({ [id]: allArticles[id] })))

export default {
  components: {
    ArticleList
  },
  data() {
    return Object.assign({
      articles,
      videos
    }, config, home)
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
    padding: 1rem;
    background-color: var(--iorg-primary-dark-color);
    font-size: 2rem;
    color: var(--iorg-primary-light-color);
  }
  &.intro {
    font-size: 1.125rem;
    line-height: 1.375;
  }
  &.content-list {
    .section-title {
      margin-bottom: -3rem;
      border-bottom: 2px solid var(--iorg-accent);
      font-size: 1.25rem;
      font-weight: bold;
      color: var(--iorg-accent);
      transform: skew(0, -16deg) translateY(0.5rem);
      transform-origin: bottom left;
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
    & {
      margin: 1rem;
      max-width: 20rem;
    }
    &.text {
      max-width: 40rem;
    }
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
