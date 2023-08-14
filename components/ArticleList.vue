<i18n lang="yaml">
_tw:
  publishedAt: "發布"
  updatedAt: "更新"
_en:
  publishedAt: "Published"
  updatedAt: "Updated"
</i18n>

<template>
<div class="article-list container-wrapper">
  <div class="articles container">
    <template v-for="(article, id, index) of articles">
      <nuxt-link :key="article.id" :to="localeRoute(article.path ? { path: article.path } : { name: 'a-id', params: { id: article.id } })" class="article block panel tiled filled" :class="articleClasses">
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
      <div v-if="isDAList && index === 0" :key="index" class="panel tiled">
        <subscribe-simple />
      </div>
    </template>
  </div>
</div>
</template>

<script>
import { optimizeTracking } from '~/lib/typography'
import { localizeArticle } from '~/lib/i18n'
import allArticles from '~/data/articles.json'
import SubscribeSimple from '~/components/SubscribeSimple'

export default {
  components: {
    SubscribeSimple
  },
  props: {
    type: {
      type: String,
      default: 'article+video' // types = article video research da eval sys
    },
    showAll: { // show every type + ignore show attr
      type: Boolean,
      default: false
    }
  },
  data() {
    if(this.showAll) {
      this.type = 'article+da+eval+video+research+sys'
    }
    const keys = Object.keys(allArticles)
    const articles = Object.assign({}, ...keys.filter(k => {
      const a = allArticles[k]
      return (this.type === 'featured' ? a.featured : this.type.includes(a.type)) && (this.showAll ? true : a.show)
    }).map(k => ({ [k]: allArticles[k] })))
    return {
      articles
    }
  },
  computed: {
    articleCount() {
      return Object.keys(this.articles).length
    },
    isDAList() {
      return this.type === 'da'
    },
    isFeaturedArticleList() {
      return this.type === 'featured'
    },
    articleClasses() {
      const classes = []
      if(this.isDAList) {
        classes.push('xlarge')
      } else if(this.isFeaturedArticleList) {
        classes.push('xlarge')
      }
      return classes
    }
  },
  mounted() {
    this.$emit('article-count', this.articleCount)
  },
  methods: {
    optimizeTracking,
    getLocalizedDoc(article) {
      return localizeArticle(article, this.$i18n.locale)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/resources';

.article-list {
  .article {
    > .detail {
      > h3 {
        font-size: 1.125rem;
      }
      > h4 { // subtitle
        margin: 0.125rem 0;
        font-size: 0.75rem;
        font-weight: normal;
        color: var(--iorg-accent);
      }
      > .dates {
        margin: 0.25rem 0 0.125rem;
        font-size: 0.75rem;
        color: var(--iorg-neutral);
      }
    }
  }
}
</style>
