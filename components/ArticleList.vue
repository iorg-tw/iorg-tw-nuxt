<i18n lang="yaml">
tw:
  publishedAt: "發佈於"
  updatedAt: "最後更新於"
en:
  publishedAt: "Published at"
  updatedAt: "Last updated at"
</i18n>

<template>
<div class="article-list">
  <div class="articles container">
    <nuxt-link v-for="article of articles" :key="article.id" :to="{ name: contentTypes[article.type].dir + '-id', params: { id: article.id } }" class="article block panel tiled filled">
      <img v-if="article.coverImage" :src="article.coverImage" class="cover" />
      <div class="detail">
        <h3 v-html="optimizeTracking(article.title)"></h3>
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
import allArticles from '~/data/articles.json'

const contentTypes = {
  article: {
    dir: 'a'
  },
  video: {
    dir: 'v'
  }
}

export default {
  props: {
    type: {
      type: String,
      default: 'article'
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
      articles,
      contentTypes
    }
  },
  methods: {
    optimizeTracking
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
