<i18n lang="yaml">
tw:
  description: "IORG 於 2019 年成立，由新聞媒體工作者、社會科學家、資料科學家、社會運動者組成，目的在於紀錄、研究、理解資訊操弄、加強資訊判讀，以應對認知戰。"
  intro: "針對資訊操弄、資訊戰的研究，必須跨領域、資料驅動而嚴謹，方能確實了解認知戰，並適當回應，以捍衛自由、強化台灣民主。"
  articles: "報導"
  videos: "影音"
en:
  description: "IORG is a Taiwan-based multidisciplinary research group formed in 2019 by media workers, social scientists, data scientists, and local activists. IORG researches information manipulation and strengthens information literacy in response to cognitive warfare."
  intro: "A multidisciplinary, data-driven, rigorous understanding of information operation & manipulation is needed in order to devise appropriate responses to respond to cognitive warfare, protect Taiwan’s civil liberties, and strengthen Taiwan’s democracy."
  articles: "Articles"
  videos: "Videos"
</i18n>

<template>
<div class="page index">
  <section id="r" class="report-list">
    <div class="reports container">
      <div v-for="report of reports" :key="report.title" class="report panel tiled compact">
        <a class="cover block" :href="report.actions[0].url"><img :src="report.image" /></a>
        <div v-for="(action, actionIndex) of report.actions" :key="action.label" class="action" :class="actionIndex < 1 ? ['primary'] : []">
          <a :href="action.url" class="block"><span>{{ action.label }}</span></a>
        </div>
        <h2>{{ report.title }}</h2>
        <p class="description">{{ report.description }}</p>
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
  &.report-list {
    .report {
      > .cover {
        border-radius: 0.25rem;
        overflow: hidden;
        background-color: white;
        @include shadow;
      }
      > .action {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0.75rem 0 0;
        & > a {
          color: var(--iorg-text);
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          > span {
            line-height: 1;
            border-bottom: 2px solid var(--iorg-text);
          }
        }
        &.primary > a {
          background-color: var(--iorg-primary-dark-color);
          color: var(--iorg-primary-light-color);
          line-height: 1;
          padding: 0.75em 1em;
          border-radius: 1.25em;
          > span {
            border-bottom: none;
          }
        }
      }
      > h2 {
        margin: 0.5rem 0 0.125rem;
        font-size: 0.875rem;
      }
      > .description {
        font-size: 0.875rem;
      }
    }
  }
  &.description {
    padding: 1rem;
    background-color: var(--iorg-primary-dark-color);
    font-size: 2rem;
    color: var(--iorg-primary-light-color);
  }
}

</style>
