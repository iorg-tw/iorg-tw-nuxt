<template>
<div class="page demo">
  <div v-for="objL0 of structuredDoc" :key="objL0.header" class="objL0">
    <div :is="objL0.titleTag">{{ objL0.title }}</div>
    <div v-html="objL0.html"></div>
    <div v-if="objL0.children" class="children">
      <div v-for="objL1 of objL0.children" :key="objL1.header" class="objL1">
        <div :is="objL1.titleTag">{{ objL1.title }}</div>
        <div v-html="objL1.html"></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { getDoc, structureDoc } from '~/lib/gdoc'

export default {
  async asyncData() {
    const url = 'https://docs.google.com/document/d/e/2PACX-1vTLvc6G378TNi99QLg06bt8i1W-uNZVFUBwDTVTE-dBxix7lvgVeIJIweeqBXBQez0b3M3U1THvxfik/pub'

    const doc = await getDoc(url)
    const structuredDoc = structureDoc(doc.html, ['h2', 'h3'])
    return {
      structuredDoc
    }
  }
}
</script>

<style lang="scss">
.page.demo {
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
</style>
