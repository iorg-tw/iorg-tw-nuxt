<template>
<div class="page demo">
  <div class="demo preview">
    <a class="demo-header block"><span>Preview</span></a>
    <div class="context social-media">
      <img class="cover" :src="head._image" />
      <p class="title">{{ head.title }}</p>
      <p v-if="!head._description" class="description not-available" >No description</p>
      <p v-else class="description">{{ head._description }}</p>
    </div>
  </div>
  <div class="demo demo-1">
    <a class="demo-header block"><span>Demo 1</span></a>
    <div v-for="objL0 of structuredDoc" :key="objL0.header" class="objL0">
      <div :is="objL0.titleTag">{{ objL0.title }}</div>
      <div class="html" v-html="objL0.html"></div>
      <div v-if="objL0.children" class="children">
        <div v-for="objL1 of objL0.children" :key="objL1.header" class="objL1">
          <div :is="objL1.titleTag">{{ objL1.title }}</div>
          <div class="html" v-html="objL1.html"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="demo demo-2">
    <a class="demo-header block"><span>Demo 2</span></a>
    <google-doc :doc="doc" />
  </div>
  <div class="demo demo-3">
    <a class="demo-header block"><span>Demo 3</span></a>
    <google-doc :doc="doc" :options="{ metaphor: 'page' }" />
  </div>
</div>
</template>

<script>
import { getDoc, structureDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

export default {
  components: {
    GoogleDoc
  },
  async asyncData({ query }) {
    const gid = query.gid ? query.gid : '2PACX-1vTLvc6G378TNi99QLg06bt8i1W-uNZVFUBwDTVTE-dBxix7lvgVeIJIweeqBXBQez0b3M3U1THvxfik'
    const url = `https://docs.google.com/document/d/e/${gid}/pub`

    const doc = await getDoc(url)
    const structuredDoc = structureDoc(doc.html, ['h2', 'h3'])
    const head = generateMeta(doc.title, doc.subtitle, doc.summary, doc.coverImage)
    return {
      doc,
      structuredDoc,
      head
    }
  },
  head() {
    return this.head
  }
}
</script>

<style lang="scss">
.page.demo {
  > .demo {
    margin-bottom: 4rem;
    > .demo-header {
      margin: 1rem;
      font-weight: bold;
    }
    .objL0 {
      margin: 1rem;
      border: 2px solid black;
      padding: 0.75rem;
      .objL1 {
        margin: 1rem;
        border: 1px solid black;
        padding: 0.75rem;
      }
    }
  }
  > .preview {
    > .context {
      margin-left: 1rem;
      &.social-media {
        max-width: 20rem;
        > .cover {
          width: 100%;
        }
        > .title {
          margin-top: 0.25rem;
          font-weight: bold;
        }
        > .description {
          font-size: 0.875rem;
          &.not-available {
            color: var(--iorg-neutral);
          }
        }
      }
    }
  }
}
</style>
