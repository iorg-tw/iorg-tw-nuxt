<i18n lang="yaml">
_tw:
  chinaWatch: "IORG 中國觀察"
  licensing: "IORG 中國觀察清單內容以「創用 CC 姓名標示 4.0 IORG 及匿名貢獻者」條款授權釋出。"
  add: "你可以用下方的表單增加新的觀察對象，IORG 研究員會確認你提供的資訊，並將新的觀察對象加入清單。"
_en:
  chinaWatch: "IORG China Watch"
  licensing: "Content of IORG China Watch is released under a CC BY 4.0 IORG & Anonymous Contributors license."
  add: "You can contribute to this list with the form below. IORG researcher will verify information provided, and add new targets to the list."
</i18n>

<template>
<div class="page china-watch">
  <div class="description">
    <h1>{{ $t('chinaWatch') }}</h1>
    <p>{{ $t('licensing') }}</p>
  </div>
  <div class="frame-container sheet">
    <iframe src="https://docs.google.com/spreadsheets/d/1bUUrCrLt7LN1n4u5IyNWxGl6qCI91iov3P-JfXgcZKE/edit#gid=759255365"></iframe>
  </div>
  <div class="description">
    <p>{{ $t('add') }}</p>
  </div>
  <div class="frame-container form">
    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdzw5V8JKhDVvQtuBtRznrpKujv-Hg_0PZz6VyWTPkrUmEWgg/viewform" class="form" scrolling="no"></iframe>
  </div>
</div>
</template>

<script>
import { generateMeta } from '~/lib/meta'

export default {
  head() {
    return generateMeta(this.$t('chinaWatch'))
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.china-watch {
  h1 {
    margin-bottom: 0.5rem;
  }
  > .description {
    max-width: 30rem;
    margin: 1rem;
  }
  > .frame-container {
    width: 100%;
    padding: 1rem;
    iframe {
      width: 100%;
      min-height: 65vh;
      border: none;
    }

    &.form {
      max-width: 30rem;
      margin: 1rem;
      padding: 1rem 0;
      background-color: rgb(250, 227, 225);
      iframe {
        min-height: 50rem;
        overflow: hidden;
      }
    }
  }
}
</style>
