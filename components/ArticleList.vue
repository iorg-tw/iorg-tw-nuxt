<i18n lang="yaml">
_tw:
  publishedAt: "發佈"
  updatedAt: "更新"
_en:
  publishedAt: "Published"
  updatedAt: "Updated"
</i18n>

<template>
<div class="article-list container-wrapper">
  <div class="articles container">
    <nuxt-link v-for="article of articles" :key="article.id" :to="localeRoute({ name: 'a-id', params: { id: article.id } })" class="article block panel tiled filled">
      <img v-if="getLocalizedDoc(article).coverImage" :src="getLocalizedDoc(article).coverImage" class="cover" />
      <div class="detail">
        <h3 v-html="optimizeTracking(getLocalizedDoc(article).title)"></h3>
        <h4 v-if="getLocalizedDoc(article).subtitle">{{ getLocalizedDoc(article).subtitle }}</h4>
        <div class="dates">
          <div v-if="article.publishedAt" class="published-at">{{ $t('publishedAt') }} = {{ article.publishedAt.replace(/\//g, '.') }}</div>
          <div v-if="article.updatedAt" class="updated-at">{{ $t('updatedAt') }} = {{ article.updatedAt.replace(/\//g, '.') }}</div>
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
      default: 'article+video' // types = article video research sys
    },
    showAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    if(this.showAll) {
      this.type = 'article+video+research+sys'
    }
    const keys = Object.keys(allArticles)
    const articles = Object.assign({}, ...keys.filter(k => {
      const a = allArticles[k]
      let flag = true
      if(this.type !== 'all') {
        flag = flag && this.type.includes(a.type)
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
      > h4 { // subtitle
        margin: 0.125rem 0;
        font-size: 0.75rem;
        font-weight: normal;
        color: var(--iorg-accent);
      }
      > .dates {
        margin: 0.125rem 0;
        font-size: 0.75rem;
        color: var(--iorg-neutral);
      }
    }
  }
}
</style>
