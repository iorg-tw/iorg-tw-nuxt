<template>
<div class="google-doc">
  <template v-if="options.head !== false">
    <h1 v-html="optimizeTracking(doc.title)"></h1>
    <div class="author-info">{{ doc.authorInfo }}</div>
    <div class="summary" v-html="doc.summaryHTML"></div>
    <div class="separator"></div>
  </template>
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
    },
    options: {
      type: Object,
      default: () => ({})
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
  @include doc;

  .gdoc-photo-container {
    margin: 0;
    margin-bottom: 1.5rem;
    padding: 0;
    > .images {
      width: 100%;
      @media (min-width: 768px) {
        width: calc(100% + 6rem);
        margin-left: -3rem;
      }
      background-color: var(--iorg-neutral);
      @include shadow;
      > img {
        width: 100%;
      }
    }
    > .images.grid {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      > img {
        width: 50%;
      }
    }
    > .description {
      margin: 0;
      padding-top: 0.75rem;
      padding-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #646464;
    }
  }
  .gdoc-table-container {
    > .table {
      width: 100%;
      padding: 0.5rem;
      @media (min-width: 768px) {
        width: calc(100% + 6rem);
        margin-left: -3rem;
      }
      background-color: var(--iorg-paper);
      @include shadow;
      overflow: scroll;
    }
    > .description {
      margin: 0;
      padding-top: 0.75rem;
      padding-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #646464;
    }
  }

  h1, h2, h3 {
    margin-bottom: 0.375rem;
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
    background-color: var(--iorg-text);
    margin: 1.25rem auto;
  }
  table {
    border-collapse: collapse;
    font-size: 0.875rem;
    th, td {
      min-width: 4rem;
      max-width: 20rem;
    }
    tr:not(.no-border):not(:first-of-type) {
      border-top: solid 1px var(--iorg-background);
    }
    p {
      margin-bottom: 0.5rem;
      padding-right: 0.25rem;
      padding-left: 0.25rem;
    }
    p:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
