<i18n lang="yaml">
tw:
  conclusion: "IORG 以可公開檢驗的科學方法證實：中國共產黨及中國政府確實參與對台資訊操弄。"
  intro: "IORG 於 2019 年由新聞媒體工作者、社會科學家、資料科學家、社會運動者組成，是以公開資訊、科學方法、在地連結，反制極權擴張的台灣跨領域研究團隊。"
  articles: "報導"
  videos: "影音"
en:
  conclusion: "IORG demonstrates that the CCP and Government of China are involved with information manipulation against Taiwan."
  intro: "IORG is a Taiwan-based multidisciplinary research group formed in 2019 by media workers, social scientists, data scientists, and local activists. IORG works to counter authoritarian expansion with public information, scientific methodologies, and grassroots organization."
  articles: "Articles"
  videos: "Videos"
</i18n>

<template>
<div class="page index">
  <section id="r" class="report">
    <div class="container">
      <div class="panel tiled filled">
        <div class="detail">
          <h2>{{ $t('conclusion') }}</h2>
        </div>
      </div>
      <div class="panel tiled">
        <nuxt-link class="action" to="/r">線上閱讀報告</nuxt-link>
        <nuxt-link class="action disabled" to="#">下載 PDF 完整報告內容</nuxt-link>
      </div>
    </div>
  </section>
  <section class="intro">
    <div class="container">
      <div class="panel text">
        <p v-html="$t('intro')"></p>
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
  &.report {
    .action {
      display: inline-block;
      margin: 0.25rem;
      padding: 0.75rem;
      line-height: 1;
      border-radius: 1.5rem;
      & {
        background-color: var(--iorg-primary-dark-color);
        border: 2px solid var(--iorg-primary-dark-color);
        color: var(--iorg-primary-light-color);
      }
      &.disabled {
        background: none;
        border: 2px solid #aaa;
        color: #aaa;
      }
    }
  }
  &.intro {
    padding: 1rem;
    background-color: var(--iorg-primary-dark-color);
    font-size: 2rem;
    color: var(--iorg-primary-light-color);
  }
}

</style>
