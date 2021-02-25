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
import researchDocMap from '~/data/research-docs'
import { getDoc, structureDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

export default {
  components: {
    GoogleDoc
  },
  async asyncData() {
    const doc = await getDoc(researchDocMap._G.publicURLs._tw)
    const structuredDoc = structureDoc(doc.html, ['h2'])
    return {
      doc,
      structuredDoc
    }
  },
  head() {
    return generateMeta(this.doc.title)
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

// FIXME: this is cheating
:root {
  @media (min-width: 480px) {
    --doc-spacing: 1.5rem;
  }
}

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
