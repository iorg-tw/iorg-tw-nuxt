<i18n lang="yaml">
_tw:
  published: "發佈"
  updated: "更新"
_en:
  published: "Published"
  updated: "Updated"
</i18n>

<template>
<div class="google-doc" :class="classes">
  <template v-if="showHead">
    <div class="title">
      <h1 :is="titleTag" v-if="doc.title" v-html="optimizeTracking(doc.title)"></h1>
      <p v-if="doc.subtitle" class="subtitle" v-html="optimizeTracking(doc.subtitle)"></p>
      <a v-if="enableToggle" class="toggle" @click="toggle = !toggle">{{ PUNCT.ELLIPS }}</a>
    </div>
    <ul v-if="doc.authorInfoItemsHTML" class="author-info" v-html="doc.authorInfoItemsHTML"></ul>
    <ul class="more-info">
      <li v-if="doc.publishedAt">{{ $t('published') }} = {{ doc.publishedAt.replace(/\//g, '.') }}</li><!-- FIXME: trying this out -->
      <li v-if="doc.updatedAt">{{ $t('updated') }} = {{ doc.updatedAt.replace(/\//g, '.') }}</li>
    </ul>
    <div v-if="showSummary && doc.summaryHTML" class="summary" v-html="doc.summaryHTML"></div>
    <div v-if="showSummary && doc.summaryHTML" class="separator"></div>
  </template>
  <div class="content" v-html="doc.html"></div>
  <div v-if="metaphor !== 'page'" class="separator"></div>
  <template v-if="metaphor !== 'page' && showHead">
    <ul v-if="doc.tags && doc.tags.length > 0" class="tags">
      <li v-for="tag of doc.tags" :key="tag" class="tag">{{ tag }}</li>
    </ul>
  </template>
</div>
</template>

<script>
import { PUNCT } from '~/lib/const'
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
  data() {
    return {
      toggle: true,
      PUNCT
    }
  },
  computed: {
    titleTag() {
      return this.doc.titleTag ? this.doc.titleTag : 'h1'
    },
    classes() {
      return [
        'as-' + this.metaphor,
        'title-' + this.titleTag,
        ...(this.enableToggle && this.toggle ? ['title-only'] : [])
      ]
    },
    metaphor() {
      return this.shouldSetOption('metaphor') ? this.options.metaphor : 'doc'
    },
    showHead() {
      return this.shouldSetOption('head') ? this.options.head : true
    },
    showSummary() {
      return this.shouldSetOption('showSummary') ? this.options.showSummary : true
    },
    enableToggle() {
      return this.shouldSetOption('enableToggle') ? this.options.enableToggle : false
    }
  },
  methods: {
    optimizeTracking,
    shouldSetOption(k) {
      return this.options && Object.prototype.hasOwnProperty.call(this.options, k)
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.google-doc {
  // variables
  --doc-spacing: 1rem;
  @media (min-width: 480px) {
    --doc-spacing: 1.25rem;
  }
  --page-spacing: 1.25rem;
  @media (min-width: 480px) {
    --page-spacing: 1.5rem;
  }
  --list-indent: 1.375rem;

  // sections
  > .title {
    margin-bottom: 0.5rem;
    > .subtitle {
      margin-top: 0.375rem;
      font-size: 1.25rem;
      color: var(--iorg-accent);
    }
    > .toggle {
      font-size: 0.875rem;
      cursor: pointer;
    }
  }
  > .author-info,
  > .more-info {
    padding: 0;
    list-style: none;
    font-size: 0.875rem;
    color: var(--iorg-neutral);
  }
  > .summary {
    line-height: $line-height-comfortable;
    p {
      margin-bottom: 1.5rem;
    }
  }
  > .content {
    h2, h3 {
      margin-bottom: 0.375rem;
    }
    p, ul, ol {
      margin-bottom: 1.5rem;
      line-height: $line-height-comfortable;
    }
    a.ioid {
      border-bottom-width: 1px;
      font-size: 0.625rem;
      color: var(--iorg-neutral);
      white-space: nowrap;
    }
    img.sticker.inline {
      display: inline-block;
      width: 2.5rem;
      vertical-align: bottom;
    }
    h2 img.sticker.inline {
      width: 4rem;
    }
    div.label.inline {
      display: inline-block;
      background-color: var(--iorg-accent);
      line-height: 1rem;
      padding: 0.25rem 0.5rem;
      margin: 0 0.125rem;
      border-radius: 0.75rem;
    }
    div.search {
      position: relative;
      top: -0.125rem;
      display: inline;
      background-color: var(--iorg-background-code);
      padding: 0.125rem 0.25rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      color: var(--iorg-neutral);
    }
    .gdoc-list-set {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      line-height: $line-height-compact;
      &.code {
        > li {
          margin: 0.125rem;
          padding: 0.25rem 0.375rem;
          background-color: var(--iorg-background-code);
          border-radius: 0.25rem;
        }
      }
    }
  }
  > .tags {
    list-style: none;
    margin-top: 2rem;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    > .tag {
      margin: 0.25rem;
      padding: 0.5rem 0.75rem;
      line-height: 1;
      color: var(--iorg-accent);
      border: 2px solid var(--iorg-accent);
      border-radius: 2rem;
    }
  }

  // content elements
  [class^='gdoc-'] {
    margin-bottom: 1.5rem;
  }
  .gdoc-photo-container {
    > .images {
      width: 100%;
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
      margin-top: 0.75rem;
      font-size: 0.875rem;
      color: #646464;
    }
  }
  .gdoc-youtube-container {
    > .video {
      position: relative;
      width: 100%;
      height: 0;
      margin: 0;
      padding-bottom: 56.25%;
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
  .gdoc-table-container {
    > .table {
      width: 100%;
      padding: 0.5rem;
      overflow: scroll;
      background-color: var(--iorg-paper);
      @include shadow;
    }
    > .description {
      margin: 0;
      margin-top: 0.75rem;
      font-size: 0.875rem;
      color: #646464;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
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
      th, td {
        p, ul, ol {
          line-height: $line-height-default;
        }
        p {
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
          padding-right: 0.25rem;
          padding-left: 0.25rem;
        }
        ul {
          list-style: square;
          margin: 0.25rem;
          padding: 0;
          padding-left: 1.25rem;
        }
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
        &.url {
          a {
            word-break: break-all;
          }
        }
        &.supplemental {
          color: var(--iorg-neutral);
        }
        &.yes {
          color: var(--iorg-accent);
        }
        &.no {
          color: var(--iorg-background);
        }
        &.list-set {
          > ul {
            list-style: none;
            margin: 0 0.25rem;
            padding: 0 0.25rem;
            > li {
              margin: 0;
              padding: 0;
            }
          }
        }
        &.list-set.cards {
          > ul {
            > li {
              margin: 0.25rem;
            }
          }
        }
        &.list-set.people {
          > ul {
            > li {
              margin: 0.25rem;
              > :first-child { // assume this is name
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
            display: flex;
            flex-wrap: wrap;
            margin: 0.25rem 0;
            padding: 0; // FIXME: might be bad
            > li {
              margin: 0.25rem;
              padding: 0.25rem 0.5rem;
              background-color: #ccc;
              border-radius: 1rem;
              &.ccp {
                background-color: #FF6464;
              }
              &.china {
                background-color: #FFA4A4;
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
        &.list-set {
          ul {
            font-size: 0.75rem;
            font-weight: normal;
            > li {
              padding: 0.125rem 0.375rem;
            }
          }
        }
        &.list-set.bubbles {
          ul {
            > li {
              margin: 0.125rem;
            }
          }
        }
      }
      td {
        &.url,
        &.small {
          font-size: 0.75rem;
        }
      }
    }
  }
  .gdoc-infobox {
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
      td {
        padding: 0.5rem;
        border: 1px solid var(--iorg-background);
        vertical-align: top;
        &:first-child {
          font-weight: bold;
          white-space: nowrap;
        }
        > :last-child {
          margin-bottom: 0;
        }
        ul {
          list-style: square;
          padding-left: 1rem;
        }
      }
    }
  }
  .gdoc-post {
    border: 1px solid var(--iorg-background);
    background-color: white;
    @include shadow;

    --facebook: #5252ff;
    --weibo: #ff5656;
    --line: #40dd40;
    &.facebook {
      border-color: var(--facebook);
      color: var(--facebook);
    }
    &.weibo {
      border-color: var(--weibo);
      color: var(--weibo);
    }
    &.line {
      border-color: var(--line);
      color: var(--line);
    }
    > .detail {
      padding: 0.75rem;
      > :last-child {
        margin-bottom: 0;
      }
    }
  }
  .gdoc-quote,
  .gdoc-def,
  .gdoc-note {
    border: 1px solid var(--iorg-background);
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
      > p,
      > ul {
        margin-bottom: 1.125rem;
      }
      > ul {
        padding-left: 1.125rem;
      }
      > :last-child {
        margin-bottom: 0;
      }
    }
    > .header + .detail {
      border-top: 1px solid var(--iorg-background);
    }
  }
  .gdoc-quote {
    > .header {
      font-size: 1.125rem;
    }
    > .header + .detail {
      border: none;
      padding-top: 0;
      color: var(--iorg-neutral);
    }
  }
  .gdoc-def,
  .gdoc-note {
    color: var(--iorg-neutral);
  }
  .gdoc-note {
    &.info {
      border-color: var(--iorg-accent);
      color: var(--iorg-accent);
    }
    &.warning {
      border-color: var(--iorg-warning);
      color: var(--iorg-warning);
    }
  }
  .gdoc-references {
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
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    > .action {
      margin: 0.25rem;
    }
  }
  .separator {
    &:after {
      content: '';
      display: block;
      width: 0.5rem;
      height: 0.5rem;
      background-color: var(--iorg-text);
      margin: 1.5rem auto;
    }
  }

  // for demo
  [class^='illegal-'] {
    text-decoration: line-through;
    text-decoration-color: #ff2828;
    text-decoration-thickness: 2px;
  }
}
.google-doc.as-doc {
  &.title-h1 {
    @media (min-width: 375px) {
      --doc-spacing: 1.5rem;
    }
    @media (min-width: 480px) {
      --doc-spacing: 2.5rem;
    }
  }

  max-width: $doc-max-width;
  margin: 0 auto;
  padding: var(--doc-spacing) 0;
  background-color: var(--iorg-paper);
  color: var(--iorg-text);
  border-radius: 0.75rem;
  line-height: $line-height-default;

  > .title,
  > .author-info,
  > .more-info,
  > .summary {
    margin-right: var(--doc-spacing);
    margin-left: var(--doc-spacing);
  }
  > .content {
    > h2,
    > h3,
    > p {
      margin-right: var(--doc-spacing);
      margin-left: var(--doc-spacing);
    }
    > ul,
    > ol {
      margin-right: var(--doc-spacing);
      margin-left: var(--doc-spacing);
      padding-left: var(--list-indent);
    }
  }
  > .tags {
    margin-right: var(--doc-spacing);
    margin-left: var(--doc-spacing);
  }

  $ext: 6rem;
  [class^='gdoc-'] {
    margin-right: var(--doc-spacing);
    margin-left: var(--doc-spacing);
  }
  .gdoc-photo-container,
  .gdoc-youtube-container,
  .gdoc-table-container {
    margin-right: 0;
    margin-left: 0;
    > .description {
      margin-right: var(--doc-spacing);
      margin-left: var(--doc-spacing);
    }
  }
  .gdoc-photo-container {
    > .images {
      @media (min-width: 768px) {
        width: calc(100% + #{$ext});
        margin-left: -$ext / 2;
      }
    }
    &.compact > .images {
      width: 75%;
      @media (min-width: 768px) {
        width: 55%;
      }
      margin: auto;
    }
  }
  .gdoc-youtube-container {
    > .video {
      @media (min-width: 768px) {
        width: calc(100% + #{$ext});
        margin-left: -$ext / 2;
        padding-bottom: calc(56.25% + 3.375rem);
      }
    }
  }
  .gdoc-table-container {
    > .table {
      @media (min-width: 768px) {
        width: calc(100% + #{$ext});
        margin-left: -$ext / 2;
      }
    }
  }
  .author-info {
    margin-top: 0.5rem;
  }
  .more-info {
    margin-bottom: 1.5rem;
  }
  .summary {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 1.125rem;
  }
}
.google-doc.as-page {
  max-width: $page-max-width;
  margin: 0;

  > .title,
  > .author-info,
  > .more-info,
  > .summary {
    max-width: $doc-max-width;
    margin-right: var(--page-spacing);
    margin-left: var(--page-spacing);
  }
  > .content {
    > h2,
    > h3,
    > p {
      max-width: $doc-max-width;
      margin-right: var(--page-spacing);
      margin-left: var(--page-spacing);
    }
    > ul,
    > ol {
      max-width: $doc-max-width;
      margin-right: var(--page-spacing);
      margin-left: var(--page-spacing);
      padding-left: var(--list-indent);
    }
  }
  [class^='gdoc-'] {
    margin-right: var(--page-spacing);
    margin-left: var(--page-spacing);
  }
  .gdoc-photo-container,
  .gdoc-youtube-container,
  .gdoc-table-container {
    margin-right: 0;
    margin-left: 0;
    > .description {
      margin-right: var(--page-spacing);
      margin-left: var(--page-spacing);
    }
    @media (min-width: 768px) {
      margin-right: var(--page-spacing);
      margin-left: var(--page-spacing);
      > .description {
        margin-right: 0;
        margin-left: 0;
      }
    }
  }
  .gdoc-photo-container,
  .gdoc-youtube-container {
    max-width: $doc-max-width;
  }
  .gdoc-quote,
  .gdoc-def,
  .gdoc-note,
  .gdoc-references {
    max-width: $doc-max-width;
    border-color: var(--iorg-neutral);
    > .detail {
      border-top-color: var(--iorg-neutral);
    }
  }
  .separator {
    max-width: $doc-max-width;
    margin-right: var(--page-spacing);
    margin-left: var(--page-spacing);
  }
}
.google-doc.title-only {
  > :not(.title) {
    display: none;
  }
}
</style>
