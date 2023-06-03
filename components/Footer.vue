<i18n lang="yaml">
_tw:
  about: "關於 IORG"
  open: "預設開放"
  research: "研究"
  articles: "報導"
  events: "活動"
  email: "電子郵件"
_en:
  about: "About IORG"
  open: "Open IORG"
  research: "Research"
  articles: "Articles"
  events: "Events"
  email: "Email"
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
      <p><span class="emoji">🌏</span> <nuxt-link :to="localePath('/open')">{{ $t('open') }}</nuxt-link></p>
      <p><span class="emoji">🧬</span> <nuxt-link :to="localePath('/r')">{{ $t('research') }}</nuxt-link></p>
      <p><span class="emoji">🖋</span> <nuxt-link :to="localePath('/a')">{{ $t('articles') }}</nuxt-link></p>
      <p><span class="emoji">📍</span> <nuxt-link :to="localePath('/e')">{{ $t('events') }}</nuxt-link></p>
    </div>
    <div class="panel">
      <p><span class="emoji">📬</span> {{ $t('email') }} <a href="#">hi [at] iorg [.] tw</a></p>
      <p><span class="emoji">🐦</span> <a href="https://twitter.com/iorgtw" target="_blank">@iorgtw</a></p>
      <p><span class="emoji">📙</span> <a href="https://instagram.com/infolitguide" target="_blank">資訊判讀力</a></p>
      <p><span class="emoji">🫤</span> <a href="https://facebook.com/iorgtw" target="_blank">IORG</a></p>
      <p><span class="emoji">📺</span> <a href="https://www.youtube.com/@iorgtw" target="_blank">IORG</a></p>
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
