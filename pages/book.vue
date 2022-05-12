<i18n lang="yaml">
_tw:
  bookTitle: "資訊判讀力"
  bookSubtitle: "腦袋自主！抵抗假訊息、陰謀論、帶風向的生存守則"
  booksComTw: "博客來"
  eslite: "誠品"
  taaze: "讀冊"
  RiveGauche: "左岸文化"
_en:
  bookTitle: "A Guide to Information Literacy"
  bookSubtitle: "Exploration and Survival in Taiwan’s Information Environment"
  booksComTw: "Books.com.tw"
  eslite: "Eslite"
  taaze: "Taaze"
  RiveGauche: "Rive Gauche Publishing"
</i18n>

<template>
<div class="page book">
  <div class="actions">
    <a class="button action primary" href="https://www.books.com.tw/products/0010924115" target="_blank">{{ $t('booksComTw') }}</a>
    <a class="button action primary" href="https://www.eslite.com/product/1001141162682168849004" target="_blank">{{ $t('eslite') }}</a>
    <a class="button action primary" href="https://www.taaze.tw/products/11100982245.html" target="_blank">{{ $t('taaze') }}</a>
  </div>
  <img class="book" :src="bookImage" :alt="$t('bookTitle') + PUNCT.COLON + $t('bookSubtitle') "/>
  <div class="container">
    <div class="panel tiled xlarge description">
      <h1>{{ $t('bookTitle') }}</h1>
      <h3>{{ $t('bookSubtitle') }}</h3>
      <h4>IORG {{ PUNCT.MULTIPLY }} {{ $t('RiveGauche') }} </h4>
    </div>
  </div>
  <div class="container">
    <div class="panel tiled filled">
      近期活動
    </div>
    <div class="panel tiled filled">
      訊息可信度評量練習題
    </div>
    <div class="panel tiled filled">
      註釋
    </div>
    <div class="panel tiled filled">
      補充資訊
    </div>
  </div>
</div>
</template>

<script>
import { PUNCT } from '~/lib/const'
import { generateMeta } from '~/lib/meta'
import bookImage from '~/static/images/book.png'

export default {
  data() {
    return {
      bookImage,
      PUNCT
    }
  },
  head() {
    return generateMeta(this.$t('bookTitle'), this.$t('bookSubtitle'))
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.book {
  h3 {
    margin-top: 0.25rem;
  }
  h4 {
    margin-top: 0.25rem;
    font-weight: normal;
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
  > .container {
    > .panel {
      padding: 1rem;
    }
    > .description {
      padding: 0;
    }
  }
}
</style>
