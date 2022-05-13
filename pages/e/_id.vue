<template>
<div class="page event">
  <google-doc :doc="doc" :options="{ showSummary: false }" />
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
  async asyncData({ app, params, error }) {
    const id = params.id
    const conf = confs[id]
    if(!conf) {
      error({ statusCode: 404, message: 'eventNotFound' })
      return
    }

    const defaultLocale = app.i18n.defaultLocale
    const locale = app.i18n.locale
    const localizedDoc = conf.localizedDocs[conf.localizedDocs[locale] ? locale : defaultLocale]
    let [doc] = await Promise.all([conf.cache
      ? import('~/data/cached-events/' + localizedDoc.cache + '.json')
      : getDoc(conf.publicURLs[locale])
    ])
    if(conf.cache) {
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
