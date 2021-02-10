<i18n lang="yaml">
_tw:
  research: "研究"
  articles: "報導"
  events: "活動"
_en:
  research: "Research"
  articles: "Articles"
  events: "Events"
</i18n>

<template>
<div class="navbar">
  <nuxt-link class="go-home block" :to="localePath('/')">
    <img src="/images/logo-tmp-small.png" width="64" />
  </nuxt-link>
  <div class="menu main-menu">
    <nuxt-link :to="localePath('/')" class="item block"><span>{{ $t('research') }}</span></nuxt-link>
    <nuxt-link :to="localePath('/a')" class="item block"><span>{{ $t('articles') }}</span></nuxt-link>
    <nuxt-link :to="localePath('/e')" class="item block"><span>{{ $t('events') }}</span></nuxt-link>
  </div>
  <div class="menu langs">
    <nuxt-link v-for="locale of availableLocales" :key="locale.code" :to="switchLocalePath(locale.code)" class="item block minimal"><span>文↔︎A</span></nuxt-link><!-- FIXME: assumes only two langs TW & EN -->
  </div>
</div>
</template>

<script>
export default {
  computed: {
    availableLocales() {
      return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.navbar {
  $size: 64px;
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  > .go-home {
    flex-grow: 0;
    flex-shrink: 0;
    width: $size;
  }
  > .menu {
    display: flex;
    padding: 0 0.5rem;
    > .item {
      display: block;
      margin: 0;
      padding: 0 0.375rem;
      line-height: $size;
    }
  }
  > .main-menu {
    > .item {
      @media (max-width: 400px) {
        padding: 0;
        word-break: break-all;
        min-width: 2.5rem;
        line-height: 1.15;
        transform: skew(0, -12deg) translateY(1rem) scale(0.875);
        transform-origin: bottom left;
      }
      &:first-child {
        padding-left: 0;
      }
      &:last-child {
        padding-right: 0;
      }
    }
  }
  > .langs {
    margin-left: auto;
    padding: 0.5rem 0.5rem 0 0;
    > .item {
      padding: 0 0.75rem;
      line-height: $size * 0.625;
      background-color: var(--iorg-accent);
      border-radius: $size * 0.625 / 2;
      @include shadow;
      > span {
        white-space: nowrap;
      }
    }
  }
}
</style>
