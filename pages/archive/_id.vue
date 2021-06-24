<i18n lang="yaml">
_tw:
  source: "原始來源"
  author: "作者"
  group: "群組"
  platform: "平台"
  publishedAt: "發布"
  archivedAt: "收錄"
_en:
  source: "Source"
  author: "Author"
  group: "Group"
  platform: "Platform"
  publishedAt: "Published"
  archivedAt: "Archived"
</i18n>

<template>
<div class="page archive-entry">
  <div class="entry-content">
    <img v-if="entry.displayType === 'image'" :src="baseURL + entry.fileName" :class="entry.displayType" />
    <div v-else-if="entry.displayType === 'message'" :class="entry.displayType">{{ entry.text }}</div>
  </div>
  <ul class="entry-info">
    <li class="ioid"><a>{{ entry.ioid }}</a></li>
    <li v-if="entry.author" class="author"><label>{{ $t('author') }}</label>{{ entry.author }}</li>
    <li v-if="entry.group" class="group"><label>{{ $t('group') }}</label>{{ entry.group }}</li>
    <li v-if="entry.platform" class="platform"><label>{{ $t('platform') }}</label>{{ entry.platform }}</li>
    <li v-if="entry.publishedAt" class="time"><label>{{ $t('publishedAt') }}</label>{{ entry.publishedAt }}</li>
    <li v-if="entry.archivedAt" class="time"><label>{{ $t('archivedAt') }}</label>{{ entry.archivedAt }}</li>
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
    const ioid = params.id
    const entry = archive.[ioid]
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
    return generateMeta(this.entry.ioid, this.$t('_X'), this.entry.contentInfo)
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
    border: 1px solid var(--iorg-accent);
    padding: 0;
    & {
      max-width: 100%;
      max-height: 50vh;
    }
    @media (min-width: 960px) {
      max-width: 40rem;
      max-height: 40rem;
    }
    overflow: scroll;
    > .image {
      display: block;
      max-width: 100%;
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
    > .ioid {
      font-size: 0.75rem;
      margin-bottom: 0.5rem;
    }
    > .src {
      font-size: 0.75rem;
      margin-top: 0.75rem;
    }
    label {
      display: inline-block;
      margin-right: 0.5rem;
      font-size: 0.75rem;
      vertical-align: top;
    }
  }
}
</style>
