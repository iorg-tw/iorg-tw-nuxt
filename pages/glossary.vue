<template>
<div class="page glossary">
  <div class="google-doc as-doc">
    <div class="title">
      <h1>{{ doc.title }}</h1>
    </div>
  </div>
  <div class="terms">
    <div v-for="obj of structuredDoc" :key="obj.title" class="term">
      <google-doc :doc="obj" :options="{ enableToggle: true }" />
    </div>
  </div>
</div>
</template>

<script>
import articleMap from '~/data/articles'
import { getDoc, structureDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

export default {
  components: {
    GoogleDoc
  },
  async asyncData() {
    const doc = await getDoc(articleMap._G.publicURLs._tw)
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

.page.glossary {
  padding: $default-page-padding;
  > .terms {
    > .term {
      margin-bottom: 1rem;
    }
  }
}
</style>
