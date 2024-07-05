<i18n lang="yaml">
_tw:
  about: "關於 IORG"
_en:
  about: "About IORG"
</i18n>

<template>
<section class="iorg-intro">
  <div class="content">
    <div class="tagline">{{ $t(k) }}</div>
    <div class="about">
      <nuxt-link :to="localePath('/about')" class="inverted">{{ $t('about') }}</nuxt-link>
    </div>
    <div v-if="more" class="more" v-html="more"></div>
  </div>
</section>
</template>

<script>
export default {
  props: {
    k: {
      type: String,
      default: 'iorg_about'
    },
    more: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.iorg-intro {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background-color: var(--iorg-primary-dark-color);
  color: var(--iorg-primary-light-color);
  > .content {
    max-width: 44rem;
    > .tagline {
      font-size: 1.25rem;
      line-height: 1.75rem;
    }
    > .about {
      margin: 1rem 0;
    }
    > .more {
      color: #aaa;
      p {
        line-height: $line-height-default;
        &:not(:last-of-type) {
          margin-bottom: 1.375rem;
        }
      }
    }
  }
}
</style>
