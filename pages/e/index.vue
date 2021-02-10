<i18n lang="yaml">
_tw:
  events: "活動"
  title: "活動"
  description: "IORG 資訊判讀、資訊操弄、認知戰相關活動資訊"
_en:
  events: "Events"
  title: "Events"
  description: "IORG Events"
</i18n>

<template>
<div class="page events">
  <div class="section-header first">
    <p class="section-title-fancy">{{ $t('events') }}</p>
  </div>
  <div class="event-list container">
    <div v-for="event of displayEvents" :key="[event.date, event.area, event.name].join('-')" class="event panel tiled compact filled small">
      <div class="detail">
        <div class="head">
          <label class="date">{{ event.displayDate }}</label>
          <label class="area">{{ event.area }}</label>
        </div>
        <div class="slogan">{{ event.slogan }}</div>
        <h3>{{ event.name }}</h3>
        <h4>{{ event.loc }}</h4>
        <p>{{ event.time }}</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { generateMeta } from '~/lib/meta'
import events from '~/data/events.json'

export default {
  data() {
    return {
      events
    }
  },
  computed: {
    displayEvents() {
      const list = events.filter(e => e.show).map(e => ({
        ...e,
        d: new Date([e.year, e.date].join('/')),
        displayDate: e.date.replace('/', '.')
      }))
      list.reverse()
      return list
    }
  },
  head() {
    return generateMeta(this.$t('title'), null, this.$t('description'))
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.events {
  > .event-list {
    > .event {
      > .detail {
        > .head {
          display: flex;
          align-items: center;
          > .date {
          font-size: 1.5rem;
            line-height: 1.125;
          }
          > .area {
            font-size: 0.875rem;
            margin-left: 0.25rem;
          }
        }
        > .slogan {
          margin-top: 0.125rem;
          font-size: 0.875rem;
          color: var(--iorg-accent);
        }
        > h3 {
          margin: 0.125rem 0;
        }
      }
    }
  }
}
</style>
