<i18n lang="yaml">
_tw:
  readMore: "閱讀更多"
_en:
  readMore: "Read more"
</i18n>

<template>
<div class="actions">
  <a v-for="action of actions" :key="action.name" class="action block" :href="action.url">
    <template v-if="true">
      <img class="image" :src="action.image" />
      <a :href="action.url" class="button primary">{{ $t(action.name) }}</a>
    </template>
  </a>
</div>
</template>

<script>
export default {
  data() {
    return {
      actions: [
        {
          type: 'research',
          name: 'readMore',
          image: '/images/tree-r.png',
          url: 'https://iorg.tw/r'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/resources';

.actions {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 3rem 0;
  > .action {
    max-width: 12rem;
    text-align: center;
    > .image {
      width: 100%;
      @include shadow;
    }
    > .button {
      margin-top: -1rem;
    }
  }
}
</style>
