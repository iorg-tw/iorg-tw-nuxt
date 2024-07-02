<i18n lang="yaml">
_tw:
  read: "線上閱讀報告"
_en:
  read: "Read more"
</i18n>

<template>
<div class="page home">
  <section class="da">
    <article-list type="da" features="show-featured-articles show-home-links show-sub" :first-page-size="11" />
  </section>
  <div class="divider"></div>
  <section id="r" class="report">
    <h3 class="slim science">{{ $t('iorg_sci') }}</h3>
    <div class="container">
      <div class="panel tiled filled raised">
        <div class="detail">
          <h3 v-html="optimizeTracking($t('iorg_s1'))"></h3>
        </div>
      </div>
      <div class="panel tiled filled raised">
        <div class="detail">
          <h3 v-html="optimizeTracking($t('iorg_s2'))"></h3>
        </div>
      </div>
      <div class="panel tiled filled raised">
        <div class="detail">
          <h3 v-html="optimizeTracking($t('iorg_s3'))"></h3>
        </div>
      </div>
      <div class="panel actions">
        <nuxt-link class="button action primary read-more" :to="localePath('/r')">{{ $t('read') }}</nuxt-link>
      </div>
    </div>
  </section>
  <intro k="iorg_about_long" />
</div>
</template>

<script>
import config from '~/data/config.js'
import home from '~/data/home.js'
import ArticleList from '~/components/ArticleList'
import Intro from '~/components/Intro'
import { optimizeTracking } from '~/lib/typography'

export default {
  components: {
    ArticleList,
    Intro
  },
  data() {
    return Object.assign({}, config, home, {
      showFeaturedArticles: true
    })
  },
  methods: {
    optimizeTracking,
    checkFeaturedArticleCount(count) {
      if(count < 1) {
        this.showFeaturedArticles = false
      }
    }
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
    .read-more {
      margin: 0;
      color: var(--iorg-accent);
    }
    .info {
      $accent: orange;
      $accent-dark: darkorange;
      display: inline-block;
      margin: 0.25rem;
      padding: 0.5rem 0.75rem;
      background: rgba($accent, 0.25);
      border: 1px solid rgba($accent, 0.25);
      border-radius: 0.75rem;
      font-size: 0.875rem;
      color: $accent-dark;
      > .content {
        display: flex;
        align-items: middle;
        > .emoji {
          margin-right: 0.25rem;
          font-size: 1.25rem;
          line-height: 1.25rem;
          vertical-align: baseline;
        }
      }
    }
  }
}
</style>
