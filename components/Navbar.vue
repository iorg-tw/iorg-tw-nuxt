<i18n lang="yaml">
tw:
  research: "研究"
  articles: "報導"
  videos: "影音"
  events: "活動"
en:
  research: "Research"
  articles: "Articles"
  videos: "Videos"
  events: "Events"
</i18n>

<template>
<div class="navbar">
  <nuxt-link class="go-home block" :to="{ path: '/' }">
    <img src="/images/logo-tmp-small.png" width="64" />
  </nuxt-link>
  <div class="menu main-menu">
    <nuxt-link :to="{ path: '/' }" class="item block"><span>{{ $t('research') }}</span></nuxt-link>
    <nuxt-link :to="{ path: '/a' }" class="item block"><span>{{ $t('articles') }}</span></nuxt-link>
    <nuxt-link :to="{ path: '/v' }" class="item block"><span>{{ $t('videos') }}</span></nuxt-link>
    <nuxt-link :to="{ path: '/e' }" class="item block"><span>{{ $t('events') }}</span></nuxt-link>
  </div>
  <div class="menu langs">
    <a v-for="locale of availableLocales" :key="locale.code" href="#" class="item block inverted minimal" @click.prevent.stop="$i18n.setLocale(locale.code)"><span>{{ locale.name }}</span></a>
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
$size: 64px;
.navbar {
  display: flex;
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
      padding: 0 0.375rem;
      line-height: $size;
    }
  }
  > .main-menu {
    > .item {
      @media (max-width: 400px) {
        padding: 0 0.25rem;
        word-break: break-all;
        max-width: 3.5rem;
        line-height: 1.15;
        transform: skew(0, -12deg) translateY(0.75rem) scale(0.875);
        transform-origin: bottom left;
      }
    }
  }
  > .langs {
    margin-left: auto;
    background-color: var(--iorg-text);
    > .item {
      line-height: $size * 0.625;
    }
  }
}
</style>
