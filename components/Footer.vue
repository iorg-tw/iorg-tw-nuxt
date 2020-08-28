<i18n lang="yaml">
tw:
  manifesto: "針對資訊操弄、資訊戰的研究，必須跨領域、資料驅動而嚴謹，方能確實理解認知戰的威脅，並適當應對，以捍衛自由、強化台灣民主。"
  about: "關於我們"
  email: "電子郵件"
  doki: "心慌保全"
en:
  manifesto: "A multidisciplinary, data-driven, rigorous understanding of information operation & manipulation is needed in order to devise appropriate responses to respond to cognitive warfare, protect Taiwan’s civil liberties, and strengthen Taiwan’s democracy."
  about: "About us"
  email: "Email"
  doki: "Dokidoki Safety"
</i18n>

<template>
<footer>
  <section class="text intro">
    <div class="container">
      <div class="panel text">
        <p>{{ $t('manifesto') }}</p>
      </div>
    </div>
  </section>
  <section class="contact">
    <div class="container">
      <div class="panel">
        <p><nuxt-link to="/about">{{ $t('about') }}</nuxt-link></p>
        <p>{{ $t('email') }} - <a href="#">io [at] iorg.tw</a></p>
        <p>Twitter - <a href="https://twitter.com/iorgtw" target="_blank">@iorgtw</a></p>
        <p>Facebook - <a href="https://facebook.com/Dokidokisafety" target="_blank">{{ $t('doki') }}</a></p>
      </div>
    </div>
  </section>
</footer>
</template>

<style lang="scss">
footer {
  margin-top: 6rem;
  border-top: 0.25rem solid var(--iorg-text);
  padding-bottom: 2rem;
}
</style>
