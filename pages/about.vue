<template>
<div class="page research">
  <google-doc :doc="localizedDoc" />
</div>
</template>

<script>
import articleMap from '~/data/articles'
import { getDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

export default {
  components: {
    GoogleDoc
  },
  async asyncData() {
    const docURLs = [
      articleMap.about.publicURLs._tw,
      articleMap.about.publicURLs._en
    ] // 0 = _tw; 1 = _en
    const docs = await Promise.all(docURLs.map(url => getDoc(url)))
    return {
      localizedDocs: {
        _tw: docs[0],
        _en: docs[1]
      }
    }
  },
  computed: {
    localizedDoc() {
      return this.localizedDocs[this.$i18n.locale]
    }
  },
  head() {
    return generateMeta(this.localizedDoc.title)
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.research {
  padding: $default-page-padding;
}
</style>
