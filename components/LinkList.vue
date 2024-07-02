<template>
<div class="link-list">
  <a v-for="link of links" :key="link.url" class="link button action average" :href="link.url">{{ link.emoji }} <span>{{ link.label }}</span></a>
</div>
</template>

<script>
import allLinks from '~/data/links.json'
export default {
  props: {
    group: {
      type: String,
      default: 'homepage' // types = article video research da eval sys
    }
  },
  data() {
    const locale = this.$i18n.locale
    return {
      links: allLinks.filter(link => link.group === this.group).map(link => ({
        ...link,
        label: link.locales[locale]
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/resources';

.link-list {
  width: 100%;
  padding: 0 0.5rem;
  display: flex;
  flex-wrap: wrap;
  > .link {
    $m: 0.5rem;
    display: block;
    margin: $m;
    flex-basis: calc((100% - #{$m * 4}) / 2); // 2-up
    text-align: center;
  }
}
</style>
