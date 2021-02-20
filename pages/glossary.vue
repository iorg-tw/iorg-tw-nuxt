<template>
<div class="page glossary">
  <div class="doc-header doc-side-margins">
    <h1>{{ doc.title }}</h1>
  </div>
  <div v-for="obj of structuredDoc" :key="obj.title" class="article">
    <google-doc :doc="obj" />
  </div>
</div>
</template>

<script>
import { articleMap } from '~/data/research'
import { getDoc, structureDoc } from '~/lib/gdoc'
import GoogleDoc from '~/components/GoogleDoc'

export default {
  components: {
    GoogleDoc
  },
  async asyncData() {
    const doc = await getDoc(articleMap.glossary.publicURL)
    const structuredDoc = structureDoc(doc.html, ['h2'])
    return {
      doc,
      structuredDoc
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.glossary {
  padding: $default-page-padding;
  .doc-side-margins {
    max-width: $doc-max-width;
    margin-right: auto;
    margin-left: auto;
  }
  > .doc-header {
    margin-bottom: 0.5rem;
  }
  > .article {
    margin-bottom: 2rem;
  }
}
</style>
