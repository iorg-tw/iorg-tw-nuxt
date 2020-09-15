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
  <div class="event-list">
    <div v-for="event of displayEvents" :key="[event.date, event.area, event.name].join('-')" class="event">
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
    $m: 0.75rem;
    margin: 1rem - ($m / 2);
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;

    > .event {
      display: block;
      flex-basis: calc((100% - #{$m * 4}) / 2);
      @media (min-width: 480px) {
        flex-basis: 12rem;
      }
      margin: $m;
      border-radius: 0.25rem;
      overflow: hidden;
      background-color: var(--iorg-paper);
      color: var(--iorg-text);
      @include shadow;
      > .detail {
        padding: 0.75rem;
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
