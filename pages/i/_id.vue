<template>
<div class="page interview">
  <google-doc :doc="doc" />
  <actions />
</div>
</template>

<script>
import { getDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'
import Actions from '~/components/Actions'

import interviews from '~/data/interviews.json'

export default {
  components: {
    GoogleDoc,
    Actions
  },
  async asyncData({ params, error }) {
    const id = params.id
    const interview = interviews[id]
    if(!(interview && interview.published)) {
      error({ statusCode: 404, message: 'Interview not found' })
      return
    }
    const doc = await getDoc(interview.publicURL)
    return {
      interview,
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

.page.interview {
  padding: $default-page-padding;
}
</style>
