<i18n lang="yaml">
_tw:
  about: "關於"
  open: "開放"
  research: "研究"
  reports: "報告"
  events: "活動"
  email: "電子郵件"
  twitter: "推特"
  instagram: "IG"
  facebook: "臉書"
  youtube: "YT"
_en:
  about: "About"
  open: "Open"
  research: "Research"
  reports: "Reports"
  events: "Events"
  email: "Email"
  twitter: "Twitter"
  instagram: "Instagram"
  facebook: "Facebook"
  youtube: "YouTube"
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
      <p class="item"><span class="emoji">👋</span> <nuxt-link :to="localePath('/about')">{{ $t('about') }}</nuxt-link></p>
      <p class="item"><span class="emoji">🌏</span> <nuxt-link :to="localePath('/open')">{{ $t('open') }}</nuxt-link></p>
      <p class="item"><span class="emoji">🧬</span> <nuxt-link :to="localePath('/r')">{{ $t('research') }}</nuxt-link></p>
      <p class="item"><span class="emoji">🖋</span> <nuxt-link :to="localePath('/a')">{{ $t('reports') }}</nuxt-link></p>
      <p class="item"><span class="emoji">📍</span> <nuxt-link :to="localePath('/e')">{{ $t('events') }}</nuxt-link></p>
    </div>
    <div class="panel">
      <p class="item"><span class="emoji">🐦</span> <a href="https://twitter.com/iorgtw" target="_blank">{{ $t('twitter') }}</a></p>
      <p class="item"><span class="emoji">🖼️</span> <a href="https://instagram.com/iorg.tw" target="_blank">{{ $t('instagram') }}</a></p>
      <p class="item"><span class="emoji">🫤</span> <a href="https://facebook.com/iorgtw" target="_blank">{{ $t('facebook') }}</a></p>
      <p class="item"><span class="emoji">📺</span> <a href="https://youtube.com/@iorgtw" target="_blank">{{ $t('youtube') }}</a></p>
      <p class="item"><span class="emoji">📬</span> {{ $t('email') }} <a href="#">hi [at] iorg.tw</a></p>
    </div>
  </div>
</footer>
</template>

<style lang="scss">
footer {
  margin-top: 6rem;
  border-top: 0.25rem solid var(--iorg-text);
  padding-bottom: 2rem;
  .item {
    margin-bottom: 0.25rem;
  }
  .emoji {
    font-size: 1.25rem;
    line-height: 1.375rem;
  }
  .manifesto > .content {
    max-width: 30rem;
  }
}
html[lang*="en"] footer {
  .manifesto > .content {
    font-family: Georgia, serif;
  }
}
</style>
