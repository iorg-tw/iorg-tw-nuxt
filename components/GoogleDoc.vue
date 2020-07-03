<template>
<div class="google-doc">
  <h1 v-html="optimizeTracking(doc.title)"></h1>
  <div class="author-info">{{ doc.authorInfo }}</div>
  <div class="summary"><p>{{ doc.summary }}</p></div>
  <div class="separator"></div>
  <div class="content" v-html="doc.html"></div>
  <div class="separator"></div>
</div>
</template>

<script>
import { optimizeTracking } from '~/lib/typography'
export default {
  props: {
    doc: {
      type: Object,
      default: null
    }
  },
  methods: {
    optimizeTracking
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
  background-color: var(--iorg-paper);
  color: var(--iorg-primary-dark-color);
  border-radius: 0.25rem;
  // @include shadow;
  line-height: 1.5;

  > h1, h2, h3, p, .author-info {
    padding-right: var(--padding);
    padding-left: var(--padding);
  }

  .gdoc-photo {
    margin: 0;
    margin-bottom: 1.5rem;
    padding: 0;
    > img {
      width: 100%;
      @media (orientation: portrait) {
        max-height: 50vh;
      }
      @media (min-width: 768px) {
        width: calc(100% + 6rem);
        margin-left: -3rem;
      }
      @include shadow;
    }
    > .description {
      margin: 0;
      padding-top: 0.75rem;
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
    line-height: 1.625;
  }
  .author-info {
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
  }
  .summary {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .separator {
    width: 0.5rem;
    height: 0.5rem;
    background-color: var(--iorg-primary-dark-color);
    margin: 1.25rem auto;
  }
}
</style>
