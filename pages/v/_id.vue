<template>
<div class="page video">
  <google-doc :doc="doc" />
  <actions />
</div>
</template>

<script>
import { getDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'
import Actions from '~/components/Actions'

import articles from '~/data/articles.json'

export default {
  components: {
    GoogleDoc,
    Actions
  },
  async asyncData({ params, error }) {
    const id = params.id
    const video = articles[id]
    if(!(video && video.type === 'video' && video.published)) {
      error({ statusCode: 404, message: 'Interview not found' })
      return
    }
    const doc = await getDoc(video.publicURL)
    return {
      video,
      doc
    }
  },
  head() {
    return generateMeta(this.doc.title, this.doc.summary, this.doc.coverImage)
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.video {
  padding: $default-page-padding;
}
</style>
