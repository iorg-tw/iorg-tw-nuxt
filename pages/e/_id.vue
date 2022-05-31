<template>
<div class="page event">
  <google-doc :doc="doc" :options="{ showSummary: false }" />
</div>
</template>

<script>
import events from '~/data/events'
import { getDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

export default {
  components: {
    GoogleDoc
  },
  async asyncData({ app, params, error }) {
    const id = params.id
    const event = events[id]
    if(!event) {
      error({ statusCode: 404, message: 'eventNotFound' })
      return
    }

    const defaultLocale = app.i18n.defaultLocale
    const locale = app.i18n.locale
    const localizedDoc = event.localizedDocs[event.localizedDocs[locale] ? locale : defaultLocale]
    let [doc] = await Promise.all([event.cache
      ? import('~/data/cached-events/' + localizedDoc.cache + '.json')
      : getDoc(event.publicURLs[locale])
    ])
    if(event.cache) {
      doc = doc.default
    }
    return {
      doc
    }
  },
  head() {
    return generateMeta(this.doc.title)
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.event {
  padding: $default-page-padding;
}
</style>
