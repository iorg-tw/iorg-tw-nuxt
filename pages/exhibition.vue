<i18n lang="yaml">
_tw:
  title: "展覽"
_en:
  title: "Exhibition"
</i18n>

<template>
<div class="page exhibition">
  <div class="items">
    <nuxt-link v-for="(obj, id) in archive" :key="id" :to="localePath({ name: 'archive-id', params: { id } })" class="item block">
      <img :src="baseURL + obj.fileName" />
    </nuxt-link>
    <div v-for="i in 15" :key="i" class="item"></div>
  </div>
</div>
</template>

<script>
import archive from '~/data/archive.json'
import { generateMeta } from '~/lib/meta'

const baseURL = 'https://raw.githubusercontent.com/iorg-tw/archive/master/files/'

export default {
  data() {
    return {
      baseURL,
      archive
    }
  },
  head() {
    return generateMeta(this.$t('title'))
  }
}
</script>

<style lang="scss">
.page.exhibition {
  > .items {
    --margin-container: 0.875rem;
    --margin-item: 0.375rem;
    display: flex;
    flex-wrap: wrap;
    margin: var(--margin-container);
    > .item {
      --item-size: 6rem;
      $u: 120px;
      @for $i from 2 through 12 {
        $min-width: $i * $u;
        @media (min-width: #{$min-width}) {
          --item-size: calc((100vw - var(--margin-container) * 2 - var(--margin-item) * #{($i + 1) * 2}) / #{$i + 1});
        }
      }
      flex-basis: var(--item-size);
      height: var(--item-size);
      margin: var(--margin-item);
      background-color: #aaa;
      overflow: hidden;
      > img {
        max-width: calc(var(--item-size) * 3);
      }
    }
  }
}
</style>
