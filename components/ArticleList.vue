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
  <div class="articles">
    <nuxt-link v-for="article of articles" :key="article.id" :to="{ name: dir + '-id', params: { id: article.id } }" class="article block">
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

const contentTypes = {
  articles: {
    dir: 'a'
  },
  drafts: {
    dir: 'd'
  },
  interviews: {
    dir: 'i'
  }
}

export default {
  props: {
    src: {
      type: String,
      default: 'articles'
    },
    showAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const articles = require('~/data/' + this.src + '.json')
    return {
      articles,
      dir: contentTypes[this.src].dir
    }
  },
  methods: {
    optimizeTracking
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.article-list {
  margin: 0.5rem;
  > .articles {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;

    > .article {
      display: block;
      flex-basis: 100%;
      @media (min-width: 480px) {
        flex-basis: 16rem;
      }
      margin: 1rem;
      border-radius: 0.25rem;
      overflow: hidden;
      background-color: var(--iorg-paper);
      color: var(--iorg-text);
      @include shadow;

      > .cover {
        width: 100%;
      }
      > .detail {
        padding: 0.75rem;
        > .dates {
          margin: 0.25rem 0;
          font-size: 0.75rem;
        }
      }
    }
  }
}
</style>
