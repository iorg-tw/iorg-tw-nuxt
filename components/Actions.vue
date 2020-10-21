<template>
<div class="actions">
  <a v-for="action of actions" :key="action.name" class="action block" :href="action.url">
    <template v-if="action.type === 'report'">
      <img class="image" :src="action.image" />
      <a :href="action.url" class="button inline-block">{{ action.name }}</a>
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
          type: 'report',
          name: '閱讀更多',
          image: '/images/iorg-model-2-tw-cover.png',
          url: 'https://iorg-tw.github.io/documents/iorg-model-2-tw.pdf'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
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
      background-color: var(--iorg-primary-dark-color);
      color: var(--iorg-primary-light-color);
      line-height: 1;
      padding: 0.75rem 1rem;
      border-radius: 1.25rem;
      margin-top: -1rem;
    }
  }
}
</style>
