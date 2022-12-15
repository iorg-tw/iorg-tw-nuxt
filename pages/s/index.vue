<i18n lang="yaml">
_tw:
  slidedecks: "簡報"
_en:
  slidedecks: "Slidedecks"
</i18n>

<template>
<div class="page decks">
  <div class="section-header first">
    <p class="section-title-fancy">{{ $t('slidedecks') }}</p>
  </div>
  <div class="decks container">
    <a v-for="deck of decks" :key="deck.title" class="deck block panel xlarge tiled filled raised" :href="deck.from" target="_blank">
      <div class="detail">
        <h3>{{ deck.title }}</h3>
        <p v-if="deck.publishedAt" class="published-at">{{ deck.publishedAt.replace(/\//g, '.') }}</p>
        <p class="url"><span class="href">iorg.tw{{ deck.from }}</span></p>
      </div>
    </a>
  </div>
</div>
</template>

<script>
const decks = require('~/data/redirects.json').filter(entry => entry.type === 'slidedeck')

export default {
  data() {
    return {
      decks
    }
  }
}
</script>

<style lang="scss">
.page.decks {
  .decks > .deck > .detail > .url, .published-at {
    margin: 0.25rem 0 0;
    font-size: 0.75rem;
    color: var(--iorg-neutral);
    > .href {
      border-bottom: 2px solid currentColor;
    }
  }
}
</style>
