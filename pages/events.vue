<i18n lang="yaml">
tw:
  events: "公開活動"
en:
  events: "Public Events"
</i18n>

<template>
<div class="page events">
  <div class="container">
    <div class="panel text">
      <p class="section-title">{{ $t('events') }}</p>
    </div>
  </div>
  <div class="event-list container">
    <div v-for="event of displayEvents" :key="[event.date, event.area, event.name].join('-')" class="event panel tiled compact filled small">
      <div class="detail">
        <div class="head">
          <label class="date">{{ event.displayDate }}</label>
          <label class="area">{{ event.area }}</label>
        </div>
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
      title: '公開活動 Public Events',
      description: 'IORG 資訊判讀、資訊操弄、認知戰相關公開活動資訊',
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
      list.sort((a, b) => b.d - a.d)
      return list
    }
  },
  head() {
    return generateMeta(this.title, this.description)
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
        > h3 {
          margin: 0.125rem 0;
        }
      }
    }
  }
}
</style>
