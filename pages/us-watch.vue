<i18n lang="yaml">
_tw:
  usWatch: "IORG 美國觀察清單"
_en:
  usWatch: "IORG U.S. Watch"
</i18n>

<template>
<div class="page us-watch">
  <div class="description">
    <h1>{{ $t('usWatch') }}</h1>
  </div>
</div>
</template>

<script>
import { generateMeta } from '~/lib/meta'

export default {
  head() {
    return generateMeta(this.$t('usWatch'))
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.us-watch {
  h1 {
    margin-bottom: 0.5rem;
  }
  > .description {
    max-width: 30rem;
    margin: 1rem;
  }
}
</style>
