<template>
<div class="page glossary">
  <div class="title-doc google-doc as-page">
    <div class="title">
      <h1>{{ doc.title }}</h1>
    </div>
    <div class="content">
      <p>{{ doc.summary }}</p><!-- FIXME: this is a hack -->
    </div>
  </div>
  <div class="terms">
    <google-doc v-for="obj of structuredDoc" :key="obj.title" :doc="obj" :options="{ enableToggle: true }" class="term" />
  </div>
</div>
</template>

<script>
import { getLocalizedArticles } from '~/lib/i18n'
import { structureDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

const ID = '_G'

export default {
  components: {
    GoogleDoc
  },
  async asyncData({ app }) {
    const [doc] = await getLocalizedArticles([ID], app.i18n.locale, app.i18n.defaultLocale)
    const structuredDoc = structureDoc(doc.html, ['h2'])
    return {
      doc,
      structuredDoc
    }
  },
  head() {
    return generateMeta(this.doc.title, '', this.doc.summary)
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
