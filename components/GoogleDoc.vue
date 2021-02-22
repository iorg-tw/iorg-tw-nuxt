<template>
<div class="google-doc">
  <template v-if="options.head !== false">
    <h1 :is="doc.titleTag ? doc.titleTag : 'h1'" v-if="doc.title" class="title" v-html="optimizeTracking(doc.title)"></h1>
    <p v-if="doc.subtitle" class="subtitle" v-html="optimizeTracking(doc.subtitle)"></p>
    <ul v-if="doc.authorInfo" class="author-info">
      <li v-for="author of doc.authorInfo" :key="author" class="author">{{ author }}</li>
    </ul>
    <div v-if="showSummary" class="summary" v-html="doc.summaryHTML"></div>
    <div v-if="showSummary && doc.summaryHTML" class="separator"></div>
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
  computed: {
    showSummary() {
      return this.options && Object.prototype.hasOwnProperty.call(this.options, 'showSummary') ? this.options.showSummary : true
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
      padding-right: var(--doc-spacing);
      padding-left: var(--doc-spacing);
      font-size: 0.875rem;
      color: #646464;
    }
    &.compact > .images {
      width: 75%;
      @media (min-width: 768px) {
        width: 55%;
      }
      margin: auto;
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
      padding-right: var(--doc-spacing);
      padding-left: var(--doc-spacing);
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
  .gdoc-def,
  .gdoc-note {
    margin-right: var(--doc-spacing);
    margin-left: var(--doc-spacing);
    margin-bottom: 1.5rem;
    border: 1px solid var(--iorg-background);
    color: var(--iorg-neutral);
    overflow: hidden;
    > .header {
      padding: 0.75rem;
      > p {
        margin-bottom: 0;
      }
    }
    > .detail {
      font-size: 0.875rem;
      padding: 0.75rem;
      > :last-child {
        margin-bottom: 0;
      }
    }
    > .header + .detail {
      padding-top: 0;
    }
  }
  .gdoc-note {
    background-color: #ddd;
  }
  .gdoc-references {
    margin-right: var(--doc-spacing);
    margin-left: var(--doc-spacing);
    margin-bottom: 1.5rem;
    font-size: 0.75rem;
    border: 1px solid var(--iorg-background);
    color: var(--iorg-neutral);
    > ul {
      margin: 1rem;
      padding: 0;
      list-style: none;
      > li {
        margin: 0.5rem 0;
        padding-left: 0.75rem;
        text-indent: -0.75rem;
      }
    }
  }
  .gdoc-actions {
    margin-bottom: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    > .action {
      margin: 0.25rem;
    }
  }

  h1, h2, h3 {
    margin-bottom: 0.375rem;
  }
  .subtitle {
    font-size: 1.25rem;
    color: var(--iorg-accent);
  }
  p, ul, ol {
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
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
    p, ul, ol {
      line-height: 1.5;
    }
    th, td {
      & {
        min-width: 4rem;
        max-width: 20rem;
        vertical-align: top;
      }
      @each $k, $v in $td-widths {
        $w: $v + $td-m;
        &.w-min-#{$k} {
          min-width: $w;
        }
        &.w-max-#{$k} {
          max-width: $w;
        }
        &.w-fixed-#{$k} {
          min-width: $w;
          max-width: $w;
        }
      }
      &.datetime {
        min-width: 10rem;
      }
      &.list-set.cards {
        > ul {
          list-style: none;
          margin: 0;
          padding: 0;
          > li {
            margin: 0.25rem;
          }
        }
      }
      &.list-set.people {
        > ul {
          list-style: none;
          margin: 0;
          padding: 0;
          > li {
            margin: 0.25rem;
            padding: 0;
            > :first-child { // name
              display: inline-block;
              padding: 0.125rem 0.5rem;
              margin-left: -0.5rem;
              border-radius: 1rem;
              background-color: #ccc;
            }
            > .status {
              display: inline-block;
              font-size: 0.625rem;
              line-height: 0.875rem;
              vertical-align: top;
              color: var(--iorg-neutral);
            }
          }
        }
      }
      &.list-set.bubbles {
        > ul {
          list-style: none;
          margin: 0;
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
      p {
        margin-top: 0.25rem;
        margin-bottom: 0.25rem;
        padding-right: 0.25rem;
        padding-left: 0.25rem;
      }
    }
    th {
      & {
        text-align: left;
        font-weight: bold;
        vertical-align: bottom;
      }
      &.list-set {
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
  }
}
</style>
