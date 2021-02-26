<template>
<div class="page glossary">
  <div class="doc-header">
    <h1>{{ doc.title }}</h1>
  </div>
  <div class="terms">
    <div v-for="obj of structuredDoc" :key="obj.title" class="term">
      <google-doc :doc="obj" :options="{ enableToggle: true }" />
    </div>
  </div>
</div>
</template>

<script>
import docMap from '~/data/docs'
import { getDoc, structureDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

export default {
  components: {
    GoogleDoc
  },
  async asyncData() {
    const doc = await getDoc(docMap._G.publicURLs._tw)
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
  > .terms {
    > .term {
      margin-bottom: 1rem;
    }
  }
}
</style>
