<i18n lang="yaml">
_tw:
  source: "原始來源"
_en:
  source: "Source"
</i18n>

<template>
<div class="page archive-file">
  <div class="file-container">
    <img :src="baseURL + file.fileName" class="file" />
  </div>
  <ul class="file-info">
    <li class="id"><a>{{ file.id }}</a></li>
    <li v-if="file.contentInfo" class="content-info">{{ file.contentInfo }}</li>
    <li v-if="file.platform" class="platform">{{ file.platform }}</li>
    <li v-if="file.srcURL" class="src"><a :href="file.srcURL" target="_blank">{{ $t('source') }}</a></li>
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
    const file = archive.[id]
    if(!file) {
      error({ statusCode: 404, message: 'fileNotFound' })
      return
    }
    return {
      file,
      baseURL
    }
  },
  head() {
    return generateMeta(this.file.id, this.$t('_X'), this.file.contentInfo)
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.archive-file {
  padding: $default-page-padding;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;

  $m: 1.25rem;
  > .file-container {
    margin: 0 $m;
    padding: 0;
    max-height: 40rem;
    > .file {
      display: block;
      max-width: 100%;
      max-height: 40rem;
      @include shadow;
    }
  }
  > .file-info {
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
