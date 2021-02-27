<template>
<div class="actions">
  <a v-for="action of actions" :key="action.name" class="action block" :href="action.url">
    <template v-if="action.type === 'report'">
      <img class="image" :src="action.image" />
      <a :href="action.url" class="button primary">{{ action.name }}</a>
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
          image: '/images/covers/r.png',
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
