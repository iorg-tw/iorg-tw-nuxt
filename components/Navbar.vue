<i18n lang="yaml">
tw:
  reports: "報告"
  articles: "報導"
  about: "關於"
en:
  reports: "Reports"
  articles: "Articles"
  about: "About"
</i18n>

<template>
<div class="navbar">
  <nuxt-link class="go-home block" :to="{ path: '/' }">
    <img src="/images/logo-tmp-small.png" width="64" />
  </nuxt-link>
  <div class="menu main-menu">
    <nuxt-link :to="{ path: '/' }" class="item block"><span>{{ $t('reports') }}</span></nuxt-link>
    <nuxt-link :to="{ name: 'a' }" class="item block"><span>{{ $t('articles') }}</span></nuxt-link>
    <nuxt-link :to="{ path: '/about' }" class="item block"><span>{{ $t('about') }}</span></nuxt-link>
  </div>
  <div class="menu langs">
    <a href="#" v-for="locale of availableLocales" :key="locale.code" class="item block inverted minimal" @click.prevent.stop="$i18n.setLocale(locale.code)"><span>{{ locale.name }}</span></a>
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
  > .langs {
    margin-left: auto;
    background-color: var(--iorg-text);
    > .item {
      line-height: $size * 0.625;
    }
  }
}
</style>
