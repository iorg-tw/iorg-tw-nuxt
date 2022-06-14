<i18n lang="yaml">
_tw:
  upNext: "近期活動"
  confs: "會議"
  workshops: "社區工作坊"
  title: "活動"
  description: "IORG 資訊判讀、民主防衛相關活動資訊"
_en:
  upNext: "Up Next"
  confs: "Conferences"
  workshops: "Workshops"
  title: "Events"
  description: "IORG Events"
</i18n>

<template>
<div class="page events">
  <div class="section-header first">
    <p class="section-title-fancy">{{ $t('upNext') }}</p>
  </div>
  <event-list type="conf" :up-next-only="true" :show-sign-up="true" />
  <div class="section-header">
    <p class="section-title-fancy">{{ $t('confs') }}</p>
  </div>
  <event-list type="conf" />
  <div class="section-header">
    <p class="section-title-fancy">{{ $t('workshops') }}</p>
  </div>
  <event-list type="workshop" panel-classes="compact small" />
</div>
</template>

<script>
import { generateMeta } from '~/lib/meta'
import EventList from '~/components/EventList'

export default {
  components: {
    EventList
  },
  head() {
    return generateMeta(this.$t('title'), null, this.$t('description'))
  }
}
</script>
