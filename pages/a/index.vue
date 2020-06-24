<template>
<div class="page articles">
  <div class="articles">
    <nuxt-link v-for="article of articles" :key="article.id" :to="{ name: 'a-id', params: { id: article.id } }" class="article">
      <img v-if="article.coverImage" :src="article.coverImage" class="cover" />
      <div class="detail">
        <h3>{{ article.title }}</h3>
        <div class="dates">
          <div class="published-at">{{ article.publishedAt }}</div>
          <div v-if="article.updatedAt" class="updated-at">{{ article.updatedAt }}</div>
        </div>
      </div>
    </nuxt-link>
  </div>
</div>
</template>

<script>
import articles from '~/data/articles.json'

export default {
  data() {
    return {
      articles
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.articles {
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
      background-color: white;
      @include shadow;
      color: var(--iorg-primary-dark-color);

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
