<i18n lang="yaml">
_tw:
  source: "原始來源"
_en:
  source: "Source"
</i18n>

<template>
<div class="page archive-entry">
  <div class="entry-content">
    <img v-if="entry.type === 'image'" :src="baseURL + entry.fileName" :class="entry.type" />
    <div v-else-if="entry.type === 'message'" :class="entry.type">{{ entry.content }}</div>
  </div>
  <ul class="entry-info">
    <li class="id"><a>{{ entry.id }}</a></li>
    <li v-if="entry.author" class="author">{{ entry.author }}</li>
    <li v-if="entry.group" class="group">{{ entry.group }}</li>
    <li v-if="entry.platform" class="platform">{{ entry.platform }}</li>
    <li v-if="entry.srcURL" class="src"><a :href="entry.srcURL" target="_blank">{{ $t('source') }}</a></li>
  </ul>
</div>
</template>

<script>
import archive from '~/data/archive'
import { generateMeta } from '~/lib/meta'

const baseURL = 'https://raw.githubusercontent.com/iorg-tw/archive/master/files/'

export default {
  asyncData({ params, error }) {
    const id = params.id
    const entry = archive.[id]
    if(!entry) {
      error({ statusCode: 404, message: 'fileNotFound' })
      return
    }
    return {
      entry,
      baseURL
    }
  },
  head() {
    return generateMeta(this.entry.id, this.$t('_X'), this.entry.contentInfo)
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.archive-entry {
  padding: $default-page-padding;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;

  $m: 1.25rem;
  > .entry-content {
    margin: 0 $m;
    padding: 0;
    max-height: 40rem;
    > .image {
      display: block;
      max-width: 100%;
      max-height: 40rem;
      @include shadow;
    }
    > .message {
      width: 20rem;
      padding: 1rem;
      line-height: $line-height-default;
      background-color: var(--iorg-paper);
      color: var(--iorg-neutral);
    }
  }
  > .entry-info {
    list-style: none;
    width: 16rem;
    margin: $m 0 0;
    padding: $m;
    background-color: var(--iorg-paper);
    border-radius: 0.25rem;
    @include shadow;
    > .id {
      font-size: 0.75rem;
      margin-bottom: 0.25rem;
    }
    > .src {
      font-size: 0.75rem;
      margin-top: 0.75rem;
    }
  }
}
</style>
