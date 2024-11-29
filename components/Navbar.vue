<i18n lang="yaml">
_tw:
  research: "研究"
  reports: "報告"
  events: "活動"
_en:
  research: "Research"
  reports: "Reports"
  events: "Events"
</i18n>

<template>
<div class="navbar">
  <nuxt-link class="go-home block" :to="localePath('/')">
    <img src="/images/logo-2022.png" />
  </nuxt-link>
  <div class="menu main-menu">
    <nuxt-link :to="localePath('/r')" class="item block"><span class="emoji">🧬</span><span class="text">{{ $t('research') }}</span></nuxt-link>
    <nuxt-link :to="localePath('/bunkhoo')" class="item block"><span class="emoji kerning-right-2">🖋</span><span class="text">{{ $t('reports') }}</span></nuxt-link>
    <nuxt-link :to="localePath('/e')" class="item block"><span class="emoji kerning-right-4">📍</span><span class="text">{{ $t('events') }}</span></nuxt-link>
  </div>
  <div class="menu langs">
    <nuxt-link v-for="locale of availableLocales" :key="locale.code" :to="switchLocalePath(locale.code)" class="item block minimal" :class="locale.nameType"><span>{{ locale.name }}</span></nuxt-link>
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
  $size: 48px;
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  > .go-home {
    flex-grow: 0;
    flex-shrink: 0;
    width: $size;
    > img {
      width: $size;
      height: $size;
    }
  }
  > .menu {
    display: flex;
    padding: 0 0.5rem;
    > .item {
      display: block;
      margin: 0;
      padding: 0;
      line-height: $size;
      height: $size;
      overflow: hidden;
    }
  }
  > .main-menu {
    > .item {
      & {
        width: 2.75rem;
        padding: 0 0.125rem;
        text-align: center;
        > .emoji {
          display: inline-block;
          font-size: 1.5rem;
          padding-right: 0.25rem;
          border-bottom: none;
          line-height: $size;
        }
        > .text {
          display: none;
        }
      }
      @media (min-width: 640px) { // add text label
        width: auto;
        min-width: 2.5rem;
        padding: 0 0.375rem;
        text-align: left;
        > .emoji {
          &.kerning-right-2 {
            margin-right: -0.125rem;
          }
          &.kerning-right-4 {
            margin-right: -0.25rem;
          }
        }
        > .text {
          display: inline-block;
          transform: translateY(-0.25rem);
          line-height: $line-height-tight;
        }
      }
    }
    > .item + .item + .item + .item + .item + .item {
      @media (max-width: 400px) {
        display: none; // show only first 5 items in narrow viewport
      }
    }
  }
  > .langs {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0;
    > .item {
      margin-right: 0.25rem;
      padding: 0.5rem 0.75rem;
      width: 3rem;
      height: 2rem;
      line-height: 1;
      border: 2px solid currentColor;
      border-radius: 50%;
      text-align: center;
      &.text {
        font-size: 0.875rem;
        font-weight: bold;
      }
      > span {
        display: inline-block;
        line-height: 0.875rem;
      }
    }
  }
}
</style>
