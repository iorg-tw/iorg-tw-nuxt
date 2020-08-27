<i18n lang="yaml">
tw:
  about: "關於我們"
  email: "電子郵件"
  doki: "心慌保全"
en:
  about: "About us"
  email: "Email"
  doki: "Dokidoki Safety"
</i18n>

<template>
<footer>
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
