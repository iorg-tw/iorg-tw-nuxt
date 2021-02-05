<template>
<div class="page event-0305">
  <google-doc :doc="localizedDoc" :options="{ showSummary: false }" />
</div>
</template>

<script>
import { getDoc } from '~/lib/gdoc'
import GoogleDoc from '~/components/GoogleDoc'

export default {
  components: {
    GoogleDoc
  },
  async asyncData() {
    const urls = [
      'https://docs.google.com/document/d/e/2PACX-1vRwnDPBVwOyZQ3sWwgtvmnImWjjco1ynJvMdVr0rY5TxbuUmoaFCqQ00ItV-9NKEjlnAyBw901uISFX/pub',
      'https://docs.google.com/document/d/e/2PACX-1vQhtioJ53vJGtMK6QQr4Q_6gCOiy9bpn2IjOpa_WPKGJXblb1aBQ7E5YqbsFb7X6f6Jdc7yVb0DxjQN/pub'
    ] // 0 = tw; 1 = en
    const docs = await Promise.all(urls.map(url => getDoc(url)))
    return {
      localizedDocs: {
        tw: docs[0],
        en: docs[1]
      }
    }
  },
  computed: {
    localizedDoc() {
      return this.$i18n.locale === 'en' ? this.localizedDocs.en : this.localizedDocs.tw
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.event-0305 {
  padding: $default-page-padding;
}
</style>
