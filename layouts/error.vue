<template>
<div class="error">
  <h1>{{ error.statusCode }}</h1>
  <h2>{{ error.message }}</h2>
  <div class="actions">
    <nuxt-link to="/">Go home</nuxt-link>
  </div>
</div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="scss">
.error {
  margin: 1rem;
  > .actions {
    margin-top: 1rem;
  }
}
</style>
