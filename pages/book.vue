<i18n lang="yaml">
_tw:
  bookTitle: "資訊判讀力"
  bookSubtitle: "腦袋自主！抵抗假訊息、陰謀論、帶風向的生存守則"
  preorder: "75 折預購"
_en:
  bookTitle: "Information Literacy"
  bookSubtitle: "An Essential Guide Against Information Manipulation"
  "preorder": "Pre-order 25% off"
</i18n>

<template>
<div class="page book">
  <div class="description">
    <h1>{{ $t('bookTitle') }}</h1>
    <h3>{{ $t('bookSubtitle') }}</h3>
    <div class="actions">
      <a class="button action primary" href="https://docs.google.com/forms/d/e/1FAIpQLSdHOk3mhiSsg2f_uhBbTGn7k9LnefpqpGDfNBGqVA7QADnv3Q/viewform" target="_blank">{{ $t('preorder') }}</a>
    </div>
  </div>
</div>
</template>

<script>
import { generateMeta } from '~/lib/meta'

export default {
  head() {
    return generateMeta(this.$t('bookTitle'), this.$t('bookSubtitle'))
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.book {
  h1 {
    margin-bottom: 0.5rem;
  }
  > .description {
    max-width: 30rem;
    margin: 1rem;
    > .actions {
      margin: 1rem 0;
    }
  }
}
</style>
