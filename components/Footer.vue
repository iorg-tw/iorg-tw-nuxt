<i18n lang="yaml">
_tw:
  manifesto: "針對認知戰的研究，必須跨領域、資料驅動、基於嚴謹的科學方法，方能確實了解、適當回應、捍衛公民自由、強化台灣民主。"
  about: "關於 IORG"
  email: "電子郵件"
  doki: "心慌保全"
_en:
  manifesto: "A multidisciplinary, data-driven, rigorous scientific understanding of cognitive warfare is essential in order to devise appropriate responses, protect Taiwan’s civil liberties, and strengthen Taiwan’s democracy."
  about: "About IORG"
  email: "Email"
  doki: "Dokidoki Safety"
</i18n>

<template>
<footer>
  <div class="manifesto container">
    <div class="content panel">
      <p>{{ $t('manifesto') }}</p>
    </div>
  </div>
  <div class="contact container">
    <div class="panel">
      <p><span class="emoji">👋</span> <nuxt-link :to="localePath('/about')">{{ $t('about') }}</nuxt-link></p>
      <p><span class="emoji">📬</span> {{ $t('email') }} = <a href="#">io [at] iorg.tw</a></p>
      <p><span class="emoji">🐦</span> Twitter = <a href="https://twitter.com/iorgtw" target="_blank">@iorgtw</a></p>
      <p><span class="emoji">😅</span> Facebook = <a href="https://facebook.com/Dokidokisafety" target="_blank">{{ $t('doki') }}</a></p>
    </div>
  </div>
</footer>
</template>

<style lang="scss">
footer {
  margin-top: 6rem;
  border-top: 0.25rem solid var(--iorg-text);
  padding-bottom: 2rem;
  .emoji {
    font-size: 1.25rem;
    line-height: 1.375rem;
  }
  > .manifesto {
    > .content {
      max-width: 30rem;
    }
  }
}
</style>
