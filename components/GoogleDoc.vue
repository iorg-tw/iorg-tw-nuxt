<template>
<div class="google-doc" v-html="gdoc"></div>
</template>

<script>
export default {
  props: ['gdoc']
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.google-doc {
  max-width: 36rem;
  margin: 0 auto;
  padding: 1rem;
  background-color: var(--iorg-primary-light-color);
  color: var(--iorg-primary-dark-color);
  border-radius: 0.25rem;
  @include shadow;
  overflow-x: hidden; // FIXME: temporary fix to prevent horizontal scrolling
  line-height: 1.5;

  .gdoc-image-container {
    overflow-x: scroll;
  }

  h1, h2, h3 {
    margin-bottom: 0.5rem;
    line-height: 1.25;
  }
  p {
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
}
</style>
