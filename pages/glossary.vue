<template>
<div class="page glossary">
  <div class="title-doc google-doc as-doc">
    <div class="title">
      <h1>{{ doc.title }}</h1>
    </div>
  </div>
  <div class="terms">
    <google-doc v-for="obj of structuredDoc" :key="obj.title" :doc="obj" :options="{ enableToggle: true }" class="term" />
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
  > .title-doc {
    margin-bottom: 0.5rem;
  }
  > .terms {
    > .term {
      margin-bottom: 0.5rem;
    }
  }
}
</style>
