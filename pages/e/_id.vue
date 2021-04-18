<template>
<div class="page event">
  <google-doc :doc="localizedDoc" :options="{ showSummary: false }" />
</div>
</template>

<script>
import confs from '~/data/confs'
import { getDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

export default {
  components: {
    GoogleDoc
  },
  async asyncData({ params, error }) {
    const id = params.id
    const conf = confs.find(c => c.id === id)
    if(!conf) {
      error({ statusCode: 404, message: 'eventNotFound' })
      return
    }

    // FIXME: this is the old way
    const docURLs = [
      conf.publicURLs._tw,
      conf.publicURLs._en
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

.page.event {
  padding: $default-page-padding;
}
</style>
