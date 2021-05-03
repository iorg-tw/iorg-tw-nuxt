<template>
<div class="page archive">
  <div class="items">
    <nuxt-link v-for="(obj, id) in archive" :key="id" :to="localePath({ name: 'archive-id', params: { id } })" class="item block" :class="obj.type">
      <img v-if="obj.type === 'image'" :src="baseURL + obj.fileName" class="content" />
      <div v-else-if="obj.type === 'message' && obj.content" class="content">{{ obj.content.substring(0, 140) }}</div>
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
    return generateMeta(this.$t('_X'))
  }
}
</script>

<style lang="scss">
.page.archive {
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

      &.message {
        background-color: var(--iorg-paper);
        > .content {
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
