<template>
<div class="page event">
  <google-doc :doc="localizedDoc" :options="{ showSummary: false }" />
</div>
</template>

<script>
import customEvents from '~/data/custom-events'
import { getDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

export default {
  components: {
    GoogleDoc
  },
  async asyncData({ params, error }) {
    const id = params.id
    const customEvent = customEvents.find(e => e.id === id)
    if(!customEvent) {
      error({ statusCode: 404, message: 'Event not found' })
      return
    }
    const docURLs = [
      customEvent.localizedDocs._tw,
      customEvent.localizedDocs._en
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
