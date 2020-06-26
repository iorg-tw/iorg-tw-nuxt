<template>
<div class="error">
  <h1 v-if="error.statusCode === 404">{{ error.message }}</h1>
  <h1 v-else>404</h1>
  <div>
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
}
</style>
