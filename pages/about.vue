<template>
<div class="page about">
  <div class="article">
    <google-doc :doc="mainArticle" />
  </div>
  <div class="article">
    <google-doc :doc="members" :options="{ head: false }" />
  </div>
  <div class="article">
    <google-doc :doc="advisors" :options="{ head: false }" />
  </div>
</div>
</template>

<script>
import { getDoc } from '~/lib/gdoc'
import { generateMeta } from '~/lib/meta'
import GoogleDoc from '~/components/GoogleDoc'

export default {
  components: {
    GoogleDoc
  },
  async asyncData({ params, error }) {
    const mainArticleURL = 'https://docs.google.com/document/d/e/2PACX-1vQ3pepD2_U_4xinkAemxdyW6zep1xOnkwtRmLgl4nw80n_DQCGrQf-S0_juPuxuoFwFxw0GqIXpgCnD/pub'
    const membersURL = 'https://docs.google.com/document/d/e/2PACX-1vR_vMDqT-5sTCBuEBiZhkOuUH2_TMo0choYflCmlYH2Quac4erahgNb655saqLBhQoQNZnL7b_-hGUB/pub'
    const advisorsURL = 'https://docs.google.com/document/d/e/2PACX-1vRDhn6robTrDoMDWHheUn8mlZkudAhd5g6yb6YYfqcuavUTDOqzJpBQOH5iGGDubhxXcQN7ZD4GeF-A/pub'

    const [mainArticle, members, advisors] = await Promise.all([
      getDoc(mainArticleURL),
      getDoc(membersURL),
      getDoc(advisorsURL)
    ])
    return {
      mainArticle,
      members,
      advisors
    }
  },
  head() {
    return generateMeta(this.mainArticle.title, null, this.mainArticle.summary, this.mainArticle.coverImage)
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.about {
  padding: $default-page-padding;
  > .article {
    margin-bottom: 2rem;
  }
}
</style>
