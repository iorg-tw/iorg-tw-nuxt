<template>
<div class="page archive">
  <div class="items">
    <nuxt-link v-for="(obj, id) in archive" :key="id" :to="localePath({ name: 'archive-id', params: { id } })" class="item block" :class="obj.displayType">
      <img v-if="obj.displayType === 'image'" :src="baseURL + obj.fileName" loading="lazy" />
      <div v-else-if="obj.displayType === 'message' && obj.text" class="text">{{ obj.text.substring(0, 140) }}</div>
    </nuxt-link>
    <div v-for="i in 4" :key="i" class="item"></div>
  </div>
</div>
</template>

<script>
import archive from '~/data/archive.json'
import { generateMeta } from '~/lib/meta'

const baseURL = 'https://raw.githubusercontent.com/iorg-tw/archive/master/thumbs/'

export default {
  data() {
    return {
      baseURL,
      archive
    }
  },
  head() {
    return generateMeta(this.$t('_X'))
  }
}
</script>

<style lang="scss">
.page.archive {
  > .items {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    > .item {
      --item-size: 25vw;
      @for $i from 3 through 9 {
        @media (min-width: #{$i * 160px}) {
          --item-size: #{(100 / ($i + 1)) * 1vw};
        }
      }
      flex-basis: var(--item-size);
      height: var(--item-size);
      background-color: #aaa;
      overflow: hidden;
      &.image {
        > img {
          max-width: 100%;
        }
      }
      &.message {
        background-color: var(--iorg-paper);
        > .text {
          width: 150%;
          height: 100%;
          padding: 0.375rem 0.5rem;
          font-size: 0.75rem;
          color: var(--iorg-neutral);
        }
      }
    }
  }
}
</style>
