<i18n lang="yaml">
_tw:
  bookTitle: "資訊判讀力"
  bookSubtitle: "腦袋自主！抵抗假訊息、陰謀論、帶風向的生存守則"
  booksComTw: "博客來"
  eslite: "誠品"
  taaze: "讀冊"
  RiveGauche: "左岸文化"
  evals: "訊息可信度評量"
  events: "近期活動"
  practice: "訊息可信度評量練習題"
  notes: "註釋"
  addendum: "補充資訊"
  more: "更多資訊"
_en:
  bookTitle: "A Guide to Information Literacy"
  bookSubtitle: "Exploration and Survival in Taiwan’s Information Environment"
  booksComTw: "Books.com.tw"
  eslite: "Eslite"
  taaze: "Taaze"
  RiveGauche: "Rive Gauche Publishing"
  evals: "Credibility Evals"
  events: "Events"
  practice: "Practice"
  notes: "Notes"
  addendum: "Addendum"
  more: "More"
</i18n>

<template>
<div class="page book">
  <div class="actions">
    <a class="button action primary" href="https://www.books.com.tw/products/0010924115" target="_blank">{{ $t('booksComTw') }}</a>
    <a class="button action primary" href="https://www.eslite.com/product/1001141162682168849004" target="_blank">{{ $t('eslite') }}</a>
    <a class="button action primary" href="https://www.taaze.tw/products/11100982245.html" target="_blank">{{ $t('taaze') }}</a>
  </div>
  <img class="book" :src="bookImage" :alt="$t('bookTitle') + PUNCT.COLON + $t('bookSubtitle') " />
  <div class="container">
    <div class="panel tiled xlarge description">
      <h1>{{ $t('bookTitle') }}</h1>
      <h3>{{ $t('bookSubtitle') }}</h3>
      <h4>IORG {{ PUNCT.MULTIPLY }} {{ $t('RiveGauche') }} </h4>
    </div>
  </div>
  <div class="section-header">
    <p class="section-title-fancy">{{ $t('evals') }}</p>
  </div>
  <article-list type="eval" />
  <div class="section-header">
    <p class="section-title-fancy">{{ $t('events') }}</p>
  </div>
  <event-list type="conf" series="book" :show-sign-up="true" :sort="1" />
  <div class="section-header">
    <p class="section-title-fancy">{{ $t('more') }}</p>
  </div>
  <div class="extra container">
    <div class="panel tiled filled">{{ $t('practice') }}</div>
    <div class="panel tiled filled">{{ $t('notes') }}</div>
    <div class="panel tiled filled">{{ $t('addendum') }}</div>
  </div>
</div>
</template>

<script>
import { PUNCT } from '~/lib/const'
import { generateMeta } from '~/lib/meta'
import coverBook from '~/static/images/cover-book.png'
import bookImage from '~/static/images/book.png'
import ArticleList from '~/components/ArticleList'
import EventList from '~/components/EventList'

export default {
  components: {
    ArticleList,
    EventList
  },
  data() {
    return {
      bookImage,
      PUNCT
    }
  },
  head() {
    return generateMeta(this.$t('bookTitle'), this.$t('bookSubtitle'), '', coverBook)
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.book {
  h1 {
    line-height: $line-height-compressed;
  }
  h4 {
    font-weight: normal;
  }
  h1, h3, h4 {
    margin-top: 0.25rem;
  }
  > .book {
    margin: -4rem auto 1rem auto;
    width: 100%;
    max-width: 30rem;
    pointer-events: none;
  }
  > .actions {
    text-align: center;
    margin: 1rem 0;
    > .action {

    }
  }
  > .extra.container {
    > .panel {
      padding: 1rem;
    }
    > .description {
      padding: 0;
    }
  }
}
</style>
