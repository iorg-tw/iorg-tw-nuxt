<i18n lang="yaml">
_tw:
  published: "發佈"
  updated: "更新"
  toc: "目錄"
  toggle: "開合"
_en:
  published: "Published"
  updated: "Updated"
  toc: "TOC"
  toggle: "Toggle"
</i18n>

<template>
<div class="google-doc" :class="classes" ref="googleDoc">
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
  <template v-if="showTOC">
    <div class="toc static" ref="tocStatic">
      <a class="toc-title block"><span>{{ $t('toc') }}</span></a>
      <ul>
        <li v-for="section of doc.sections" :key="section.id"><a :href="`#${section.id}`" class="minimal">{{ section.titleText }}</a></li>
      </ul>
    </div>
    <div class="toc interactive" ref="tocInteractive" :class="{ pinned: tocPinned, expanded: tocExpanded }">
      <a class="toc-title block"><span>{{ $t('toc') }}</span></a>
      <a class="toc-toggle block" @click="toggleTOC"><span>{{ $t('toggle') }}</span></a>
      <ul>
        <li v-for="section of doc.sections" :key="section.id"><a :href="`#${section.id}`" class="minimal">{{ section.titleText }}</a></li>
      </ul>
    </div>
    <div class="separator"></div>
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
      tocHeight: 0,
      tocHeightCollapsed: 0,
      tocPinned: false,
      tocExpanded: false,
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
    },
    showTOC() {
      return this.metaphor === 'doc' && this.doc.sections && this.doc.sections.length > 0
    }
  },
  watch: {
    tocPinned() {
      if(!this.tocPinned) {
        this.tocExpanded = false
      }
    },
    tocExpanded() {
      const { googleDoc } = this.$refs
      googleDoc.style.setProperty('--anchor-scroll-padding-top', (this.tocExpanded ? this.tocHeight : this.tocHeightCollapsed) + 'px')
    }
  },
  mounted() {
    // activate handles
    const handles = document.querySelectorAll('.gdoc-post > .handle')
    handles.forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.target.parentNode.classList.toggle('expanded')
      })
    })

    // detect toc height
    if(this.showTOC) {
      const { googleDoc, tocStatic, tocInteractive } = this.$refs
      this.tocHeight = tocStatic.offsetHeight
      this.tocHeightCollapsed = tocInteractive.offsetHeight
      googleDoc.style.setProperty('--toc-height', this.tocHeight + 'px')
      googleDoc.style.setProperty('--toc-height-collapsed', this.tocHeightCollapsed + 'px')
      googleDoc.style.setProperty('--anchor-scroll-padding-top', this.tocHeightCollapsed + 'px')

      const that = this
      const rem = x => x * parseFloat(getComputedStyle(document.documentElement).fontSize) // rem >>> px

      const observer = new IntersectionObserver(
        ([e]) => {
          that.tocPinned = e.intersectionRatio <= 0
        }, {
          rootMargin: `${rem(3)}px 0px 0px 0px`, // toc margin * 2
          threshold: [0, 0.01] // trigger when target intersection = 0 // add 0.01 to double-check
        }
      )
      observer.observe(tocStatic)
    }
  },
  methods: {
    optimizeTracking,
    shouldSetOption(k) {
      return this.options && Object.prototype.hasOwnProperty.call(this.options, k)
    },
    toggleTOC() {
      this.tocExpanded = !this.tocExpanded
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.google-doc {
  // variables
  --doc-spacing: 1rem;
  --toc-margin: 1.5rem;
  --toc-height: 0;
  --toc-height-collapsed: 0;
  --anchor-scroll-padding-top: 0;

  @media (min-width: 480px) {
    --doc-spacing: 1.25rem;
  }
  --page-spacing: 1.25rem;
  @media (min-width: 480px) {
    --page-spacing: 1.5rem;
  }
  --list-indent: 1.375rem;
  --list-item-spacing: 0;

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
  > .toc {
    list-style: none;
    font-size: 0.9375rem; // 15px
    top: var(--toc-margin);
    margin: var(--toc-margin) var(--doc-spacing);
    padding: 1rem 1.5rem;
    background: white;
    border-radius: $rem * 3.375 / 2;
    @include shadow;
    > .toc-title,
    > .toc-toggle {
      font-weight: bold;
    }
    > .toc-toggle {
      margin-top: 0.875rem * 1.5 * -1;
      text-align: right;
      cursor: pointer;
    }
    & {
      > ul {
        margin: 0.5rem 0;
        padding: 0;
        > li {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        > li + li {
          margin-top: 0.25rem;
        }
        > li[class^=h2] {
          margin-top: 0.375rem;
        }
      }
    }
    &.interactive {
      position: -webkit-sticky;
      position: sticky;
      opacity: 0;
      > ul {
        display: none;
      }
      z-index: 10;
    }
    &.interactive.pinned {
      opacity: 1;
    }
    &.interactive.expanded {
      > ul {
        display: block;
      }
    }
    &.interactive + .separator {
      margin-top: calc(-1 * var(--anchor-scroll-padding-top));
    }
  }
  > .content {
    h2 {
      padding-top: calc(var(--anchor-scroll-padding-top) + var(--toc-margin) * 2);
      margin-top: calc(-1 * (var(--anchor-scroll-padding-top) + var(--toc-margin) * 2)); // FIXME: scroll-padding
    }
    h2, h3 {
      margin-bottom: 0.375rem;
    }
    h3 + h3 {
      margin-top: 1.5rem;
    }
    p, ul, ol {
      margin-bottom: 1.5rem;
      line-height: $line-height-comfortable;
    }
    ul, ol {
      > li {
        padding-left: var(--list-item-spacing);
        > .note {
          font-size: 0.75em;
        }
      }
    }
    ol.list-paragraphs {
      --list-indent: 2rem;
      --list-item-spacing: 0.5rem;
      > li {
        margin-bottom: 1.5rem;
      }
    }
    a.ioid,
    a.da {
      border-bottom-width: 1px;
      font-size: 0.625rem;
      font-weight: normal;
      line-height: 0.75rem;
      vertical-align: baseline;
      color: var(--iorg-neutral);
      white-space: nowrap;
      & > span + span {
        display: none;
      }
    }
    .sticker {
      display: inline-block;
      & > .content {
        display: inline-block;
        background-color: var(--iorg-accent);
        line-height: 1.0;
        padding: 0.25rem 0.625rem;
        margin: 0 0.125rem 0.125rem;
        border-radius: 1rem; // overshooting
        verticle-align: top;
      }
      &.alert > .content {
        background-color: var(--iorg-alert);
      }
      &.bad > .content {
        background-color: var(--iorg-bad);
      }
      &.danger > .content {
        background-color: var(--iorg-danger);
      }
      &.step > .content {
        background-color: var(--iorg-background);
        color: var(--iorg-text);
      }
      &.highlight > .content {
        background-color: white;
        border: 1px solid var(--iorg-accent);
      }
      &.node > .content {
        padding: 2px 3px;
        margin: 0;
        text-align: center;
        background-color: white;
        border: 1px solid var(--iorg-neutral);
        color: var(--iorg-neutral);
        font-size: 0.625rem;
        line-height: 1;
      }
    }
    h2 .sticker {
      display: block;
      margin-left: -0.625rem;
      margin-bottom: 0.25rem;
      > div {
        font-size: 1rem;
        font-weight: normal;
        line-height: 1.0;
        padding: 0.375rem 0.625rem;
      }
    }
    h3 .sticker {
      font-size: 1rem;
      font-weight: normal;
      line-height: 1.0;
    }
    div.label.inline {
      display: inline-block;
      background-color: var(--iorg-accent);
      font-size: 1rem;
      line-height: 1.0;
      padding: 0.25rem 0.5rem;
      margin: 0 0.125rem;
      border-radius: 0.75rem;
      verticle-align: middle;
    }
    .query {
      position: relative;
      top: -0.125rem;
      display: inline;
      background-color: var(--iorg-background-code);
      padding: 0.125rem 0.55rem;
      border-radius: 0.625rem;
      font-size: 0.75rem;
      line-height: 1.0;
      color: var(--iorg-neutral);
      verticle-align: middle;
    }
    ul.gdoc-list-set {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      line-height: $line-height-compact;
      // default: bubbles
      & {
        list-style: none;
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
            background-color: var(--ccp);
          }
          &.red {
            background-color: var(--ccp-affiliated);
          }
          &.pink {
            background-color: var(--china);
          }
          &.china {
            background-color: var(--china);
          }
          &.kmt {
            background-color: var(--kmt);
          }
          &.dpp {
            background-color: var(--dpp);
          }
          &.pfp {
            background-color: var(--pfp);
          }
          &.np {
            background-color: var(--np);
          }
        }
      }
      &.list-people,
      &.people {
        > li {
          margin: 0.25rem;
          border: 1px solid var(--iorg-text);
          border-radius: 0;
          background: white;
          > :first-child { // assume this is name
            display: inline-block;
            padding: 0.125rem 0.5rem;
            margin-left: -0.5rem;
            font-weight: bold;
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
      &.list-code,
      &.code {
        > li {
          margin: 0.125rem;
          padding: 0.25rem 0.375rem;
          background-color: var(--iorg-background-code);
          border-radius: 0.25rem;
          color: var(--iorg-neutral);
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
          &.w-#{$k},
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
        &.nil {
          color: var(--iorg-background);
        }
        &.danger {
          color: var(--iorg-danger);
        }
      }
      th {
        text-align: left;
        font-weight: bold;
        vertical-align: bottom;

        > ul.gdoc-list-set {
          font-size: 0.75rem;
          font-weight: normal;
          > li {
            margin: 0.125rem;
            padding: 0.125rem 0.375rem;
          }
        }
      }
      td {
        &.col-url,
        &.col-small,
        &.url,
        &.small {
          font-size: 0.75rem;
        }
        &.max {
          color: var(--iorg-max);
        }
        &.min {
          color: var(--iorg-min);
        }
        &.number {
          text-align: right;
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
    position: relative;
    --border-color: var(--iorg-background);
    --text-color: var(--iorg-text);
    & {
      &:before {
        content: var(--gdoc-post-post);
        display: inline-block;
        color: white;
        position: relative;
        top: 0.5rem;
        left: -0.5rem;
        margin: 0;
        border: none;
        border-radius: 1rem;
        padding: 0.25rem 0.5rem;
        background-color: var(--iorg-background);
        line-height: 1;
        font-size: 0.75rem;
        z-index: 1;
      }
      > .detail {
        border: 1px solid var(--border-color);
        padding: 0.75rem;
        line-height: $line-height-comfortable;
        color: var(--text-color);
        background-color: white;
        @include shadow;
        > :last-child {
          margin-bottom: 0;
        }
      }
      > .handle {
        display: none;
      }
      > .description {
        padding: 0.75rem;
        font-size: 0.875rem;
        color: #646464;
        > :last-child {
          margin-bottom: 0;
        }
      }
    }
    &.facebook {
      --border-color: var(--facebook);
      --text-color: var(--facebook);
      &:before {
        content: var(--gdoc-post-facebook);
        background-color: var(--facebook);
      }
    }
    &.weibo {
      --border-color: var(--weibo);
      --text-color: var(--weibo);
      &:before {
        content: var(--gdoc-post-weibo);
        background-color: var(--weibo);
      }
    }
    &.line {
      --border-color: var(--line);
      --text-color: var(--line);
      &:before {
        content: var(--gdoc-post-line);
        background-color: var(--line);
      }
    }
    &.ccp {
      --border-color: var(--ccp-media);
      --text-color: var(--ccp-media);
      &:before {
        content: var(--gdoc-post-ccp-media);
        background-color: var(--ccp-media);
      }
    }
    &.mail {
      &:before {
        content: var(--gdoc-post-mail);
      }
    }
    &.collapsable {
      & {
        > .detail {
          max-height: 1rem * $line-height-comfortable * 5;
          overflow: hidden;
        }
        > .handle {
          display: block;
          position: absolute;
          left: 50%;
          transform: translate(-50%, calc(-100% - 0.5rem));
          background: white;
          cursor: pointer;
        }
        > .handle:after {
          content: var(--gdoc-post-handle-show);
        }
      }
      &.expanded {
        > .detail {
           max-height: none;
        }
        > .handle:after {
          content: var(--gdoc-post-handle-hide);
        }
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
      > .header + .detail {
        border-top-color: var(--iorg-accent);
      }
    }
    &.warning {
      border-color: var(--iorg-bad);
      color: var(--iorg-bad);
      > .header + .detail {
        border-top-color: var(--iorg-bad);
      }
    }
    &.danger {
      border-color: var(--iorg-danger);
      color: var(--iorg-danger);
      > .header + .detail {
        border-top-color: var(--iorg-danger);
      }
    }
  }
  .gdoc-references {
    font-size: 0.875rem;
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
    > .stickers {
      margin-right: var(--doc-spacing);
      margin-bottom: 0.25rem;
      margin-left: calc(var(--doc-spacing) - 0.5rem);
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
    [class^="gdoc-"] {
      margin-right: 0;
      margin-left: 0;
      padding-left: 0;
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
