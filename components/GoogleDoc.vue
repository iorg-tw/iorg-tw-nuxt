<template>
<div class="google-doc">
  <template v-if="options.head !== false">
    <h1 v-html="optimizeTracking(doc.title)"></h1>
    <ul class="author-info">
      <li v-for="author of doc.authorInfo" :key="author" class="author">{{ author }}</li>
    </ul>
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
    margin: 0;
    margin-bottom: 1.5rem;
    padding: 0;

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
  .gdoc-youtube-container {
    margin: 0;
    margin-bottom: 1.5rem;
    padding: 0;
    > .video {
      position: relative;
      width: 100%;
      height: 0;
      margin: 0;
      padding-bottom: 56.25%;
      @media (min-width: 768px) {
        width: calc(100% + 6rem);
        margin-left: -3rem;
        padding-bottom: calc(56.25% + 3.375rem);
      }
      background-color: var(--iorg-paper);
      @include shadow;
      > iframe {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
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
    list-style: none;
  }
  .summary {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 1.125rem;
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
      & {
        min-width: 4rem;
        max-width: 20rem;
      }
      &.datetime {
        min-width: 10rem;
      }
      &.text-s {
        min-width: 6rem;
      }
      &.text-m {
        min-width: 10rem;
      }
      &.text-l {
        min-width: 20rem;
        max-width: 40rem;
      }
      &.ul-set {
        ul {
          list-style: none;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          > li {
            margin: 0.25rem;
            padding: 0.25rem 0.5rem;
            background-color: #ccc;
            border-radius: 1rem;

            &.ccp {
              background-color: #FF6464;
            }
            &.kmt {
              background-color: #C0C0FF;
            }
            &.dpp {
              background-color: #99FF99;
            }
            &.pfp {
              background-color: #FFCF78;
            }
            &.np {
              background-color: #FFFF64;
            }
          }
        }
      }
    }
    th {
      & {
        text-align: left;
        font-weight: bold;
        vertical-align: bottom;
      }
      &.ul-set {
        ul {
          font-size: 0.75rem;
          font-weight: normal;
          > li {
            padding: 0.125rem 0.375rem;
          }
        }
      }
    }
    tr {
      & {
        border-top: solid 1px var(--iorg-background);
      }
      &:first-of-type,
      &.no-border {
        border: none;
      }
      &:first-of-type + tr:not(.no-border) {
        border-top: solid 2px var(--iorg-text);
      }
    }
    p {
      & {
        margin-bottom: 0.5rem;
        padding-right: 0.25rem;
        padding-left: 0.25rem;
      }
      &:last-child,
      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
}
</style>
