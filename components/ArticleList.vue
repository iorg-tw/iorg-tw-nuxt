<i18n lang="yaml">
_tw:
  publishedAt: "發佈於"
  updatedAt: "最後更新於"
_en:
  publishedAt: "Published at"
  updatedAt: "Last updated at"
</i18n>

<template>
<div class="article-list container-wrapper">
  <div class="articles container">
    <nuxt-link v-for="article of articles" :key="article.id" :to="localeRoute({ name: 'a-id', params: { id: article.id } })" class="article block panel tiled filled">
      <img v-if="getLocalizedDoc(article).coverImage" :src="getLocalizedDoc(article).coverImage" class="cover" />
      <div class="detail">
        <h3 v-html="optimizeTracking(getLocalizedDoc(article).title)"></h3>
        <div class="dates">
          <div class="published-at">{{ $t('publishedAt') }} {{ article.publishedAt }}</div>
          <div v-if="article.updatedAt" class="updated-at">{{ $t('updatedAt') }} {{ article.updatedAt }}</div>
        </div>
      </div>
    </nuxt-link>
  </div>
</div>
</template>

<script>
import { optimizeTracking } from '~/lib/typography'
import { localizeArticle } from '~/lib/i18n'
import allArticles from '~/data/articles.json'

export default {
  props: {
    type: {
      type: String,
      default: 'all'
    },
    showAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const keys = Object.keys(allArticles)
    const articles = Object.assign({}, ...keys.filter(k => {
      const a = allArticles[k]
      let flag = true
      if(this.type !== 'all') {
        flag = flag && a.type === this.type
      }
      if(!this.showAll) {
        flag = flag && a.published
      }
      return flag
    }).map(k => ({ [k]: allArticles[k] })))
    return {
      articles
    }
  },
  methods: {
    optimizeTracking,
    getLocalizedDoc(article) {
      return localizeArticle(article, this.$i18n.locale, this.$i18n.defaultLocale)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/resources';

.article-list {
  .article {
    > .detail {
      > .dates {
        margin: 0.25rem 0;
        font-size: 0.75rem;
      }
    }
  }
}
</style>
