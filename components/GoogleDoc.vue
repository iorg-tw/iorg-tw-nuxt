<template>
<div class="google-doc">
  <h1>{{ doc.title }}</h1>
  <div class="author-info">{{ doc.authorInfo }}</div>
  <div class="summary"><p>{{ doc.summary }}</p></div>
  <div class="separator"></div>
  <div class="content" v-html="doc.html"></div>
  <div class="separator"></div>
</div>
</template>

<script>
export default {
  props: ['doc']
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.google-doc {
  max-width: 36rem;
  margin: 0 auto;
  padding: 1rem;
  background-color: white;
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
  }
  p {
    margin-bottom: 1.5rem;
  }
  .author-info {
    margin: 0.25rem 0;
  }
  .summary {
    margin: 0.5rem 0;
  }
  .separator {
    width: 0.5rem;
    height: 0.5rem;
    background-color: var(--iorg-primary-dark-color);
    margin: 1rem auto;
  }
}
</style>
