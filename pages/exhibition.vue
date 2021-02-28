<template>
<div class="page exhibition">
  <div class="items">
    <div v-for="(obj, id) in archive" :key="id" class="item">
      <img :src="baseURL + obj.fileName" />
    </div>
    <div v-for="i in 15" :key="i" class="item"></div>
  </div>
</div>
</template>

<script>
import archive from '~/data/archive.json'

const baseURL = 'https://raw.githubusercontent.com/iorg-tw/archive/master/files/'

export default {
  data() {
    return {
      baseURL,
      archive
    }
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
