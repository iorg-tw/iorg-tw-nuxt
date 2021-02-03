<i18n lang="yaml">
tw:
  science: "IORG 以可公開檢驗的科學方法證實⋯"
  k1: "中國共產黨及中國政府確實參與對台資訊操弄。"
  k2: "在地協力者是中國對台資訊操弄成功的關鍵因素。"
  read: "線上閱讀報告"
  download: "下載 PDF 完整報告內容"
  soon: "報告即將開放閱讀"
  articles: "報導"
  videos: "影音"
en:
  science: "IORG confirms with openly verifiable scientific methods that…"
  k1: "The CCP and Government of China are involved in information manipulation against Taiwan."
  k2: "Local collaborators are critical to the success of Chinese information manipulation against Taiwan."
  read: "Read report online"
  download: "Download full report in PDF"
  soon: "Available soon"
  articles: "Articles"
  videos: "Videos"
</i18n>

<template>
<div class="page home">
  <section id="r" class="report">
    <p class="science">{{ $t('science') }}</p>
    <div class="container">
      <div class="panel tiled filled">
        <div class="detail">
          <h3>{{ $t('k1') }}</h3>
        </div>
      </div>
      <div class="panel tiled filled">
        <div class="detail">
          <h3>{{ $t('k2') }}</h3>
        </div>
      </div>
      <div class="panel actions">
        <nuxt-link is="div" class="action disabled" to="#">{{ $t('read') }}</nuxt-link>
        <nuxt-link is="div" class="action disabled" to="#">{{ $t('download') }}</nuxt-link>
        <div class="info">
          <div class="content">
            <span class="emoji">⚠️</span>
            <span>{{ $t('soon') }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
  <intro k="long" />
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
import Intro from '~/components/Intro'

const keys = Object.keys(allArticles)
const articleKeys = keys.filter(id => allArticles[id].type === 'article' && allArticles[id].published)
const videoKeys = keys.filter(id => allArticles[id].type === 'video' && allArticles[id].published)

const articles = Object.assign({}, ...articleKeys.map(id => ({ [id]: allArticles[id] })))
const videos = Object.assign({}, ...videoKeys.map(id => ({ [id]: allArticles[id] })))

export default {
  components: {
    ArticleList,
    Intro
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

.page.home > section {
  &.report {
    .science {
      margin: 1rem 1.5rem -0.5rem;
      font-size: 1.25rem;
    }
    .actions {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
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
    .info {
      $accent: orange;
      $accent-dark: darkorange;
      display: inline-block;
      margin: 0.25rem;
      padding: 0.5rem 0.75rem;
      background: rgba($accent, 0.25);
      border: 1px solid rgba($accent, 0.25);
      border-radius: 0.25rem;
      font-size: 0.875rem;
      color: $accent-dark;
      > .content {
        display: flex;
        align-items: middle;
        > .emoji {
          margin-right: 0.25rem;
          font-size: 1.25rem;
          line-height: 1;
          vertical-align: baseline;
        }
      }
    }
  }
}

</style>
