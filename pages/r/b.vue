<template>
<div class="page research">
  <div class="section-header">
    <h1>{{ doc.title }}</h1>
  </div>
  <div class="doc-b-comp" v-html="doc.html"></div>
  <node-list :nodes="nodes" />
</div>
</template>

<script>
import tree from '~/data/research-tree'
import { getDoc } from '~/lib/gdoc'
import NodeList from '~/components/NodeList'

const CONST = {
  id: '_R_B',
  code: 'B'
}

export default {
  components: {
    NodeList
  },
  async asyncData() {
    const url = 'https://docs.google.com/document/d/e/2PACX-1vRD5hKG24sAbqGn5enX-tHf5Cfh3Uv9BKaSBdyMdb7rrLWrSVBrrq2sfgxEbyx-4tIg9AkAghZDqrtD/pub'
    const doc = await getDoc(url)
    return {
      doc
    }
  },
  data() {
    const nodes = tree.filter(node => node.parentID === CONST.id)
    return {
      nodes,
      CONST
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.research {
  padding: $default-page-padding;

  // this is a test
  .doc-b-comp {
    margin: 0 1.5rem;
    h2 {
      margin: 1.5rem 0 0.5rem;
    }
    .gdoc-table-container {
      max-width: 90rem;
      margin-bottom: 1.5rem;
      > .table {
        width: 100%;
        overflow: scroll;
        background-color: var(--iorg-paper);
        padding: 0.5rem;
        @include shadow;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
        tr {
          & {
            border-top: solid 1px var(--iorg-background);
          }
          &:first-of-type {
            border-top: none;
          }
          &:first-of-type + tr {
            border-top: solid 2px var(--iorg-text);
          }
        }
        th, td {
          min-width: 4rem;
          text-align: left;
          p {
            margin-top: 0.25rem;
            margin-bottom: 0.25rem;
            padding-right: 0.25rem;
            padding-left: 0.25rem;
          }
          ul {
            margin-top: 0.25rem;
            margin-bottom: 0.25rem;
            padding-left: 1.25rem;
          }
        }
        th {
          font-weight: bold;
          vertical-align: bottom;
        }
        td {
          vertical-align: top;
        }
      }
    }
  }
}
</style>
