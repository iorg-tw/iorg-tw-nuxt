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
  props: {
    doc: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.google-doc {
  --padding: 1rem;
  @media (min-width: 375px) {
    --padding: 1.5rem;
  }
  @media (min-width: 480px) {
    --padding: 2.5rem;
  }

  max-width: 40rem;
  margin: 0 auto;
  padding: var(--padding) 0;
  background-color: white;
  color: var(--iorg-primary-dark-color);
  border-radius: 0.25rem;
  @include shadow;
  overflow-x: hidden; // FIXME: temporary fix to prevent horizontal scrolling
  line-height: 1.5;

  > h1, h2, h3, p, .author-info {
    padding: 0 var(--padding);
  }

  .gdoc-photo {
    margin: 0;
    margin-bottom: 1.5rem;
    padding: 0;
    > img {
      width: 100%;
      max-height: 50vh;
    }
    > .description {
      margin: 0;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #646464;
    }
  }

  .gdoc-album {
    margin: 0;
    margin-bottom: 1.5rem;
    padding: 0;
    > .images {
      display: flex;
      flex-wrap: nowrap;
      align-items: flex-start;
      overflow-x: scroll;
      > .image {
        > img {
          max-width: 85%;
          max-height: 50vh;
        }
        > p {}
      }
    }
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
