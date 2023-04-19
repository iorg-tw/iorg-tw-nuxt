<i18n lang="yaml">
_tw:
  meetup: "小聚"
  title: "小聚"
  description: "IORG 台灣資訊環境小聚"
_en:
  meetup: "Meetup"
  title: "Meetup"
  description: "IORG Taiwan Information Environment Meetup"
</i18n>

<template>
<div class="page events">
  <div class="section-header">
    <p class="section-title-fancy">{{ $t('meetup') }}</p>
  </div>
  <event-list type="meetup" />
</div>
</template>

<script>
import { generateMeta } from '~/lib/meta'
import EventList from '~/components/EventList'

export default {
  components: {
    EventList
  },
  data() {
    return {
      upNextEventCount: 0
    }
  },
  methods: {
    upNextCounted(count) {
      this.upNextEventCount = count
    }
  },
  head() {
    return generateMeta(this.$t('title'), null, this.$t('description'))
  }
}
</script>
