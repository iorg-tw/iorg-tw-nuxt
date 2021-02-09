<i18n lang="yaml">
_tw:
  default: "IORG 是以公開資訊、科學方法、在地連結，反制極權擴張的台灣跨領域研究團隊。"
  long: "IORG 於 2019 年由新聞媒體工作者、社會科學家、資料科學家、社會運動者組成，是以公開資訊、科學方法、在地連結，反制極權擴張的台灣跨領域研究團隊。"
  about: "關於 IORG"
_en:
  default: "IORG is a Taiwan-based multidisciplinary research group countering authoritarian expansion with public information, scientific methodologies, and grassroots organization."
  long: "IORG is a Taiwan-based multidisciplinary research group formed in 2019 by media workers, social scientists, data scientists, and local activists. IORG works to counter authoritarian expansion with public information, scientific methodologies, and grassroots organization."
  about: "About IORG"
</i18n>

<template>
<section class="intro">
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
      default: 'default'
    },
    more: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/resources';

.intro {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background-color: var(--iorg-primary-dark-color);
  color: var(--iorg-primary-light-color);
  > .content {
    max-width: 44rem;
    > .tagline {
      font-size: 1.75rem;
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
