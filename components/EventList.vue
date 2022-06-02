<template>
<div class="event-list container">
  <div v-for="event of events" :key="event.id" class="event panel tiled filled raised" :class="panelClasses">
    <div class="detail">
      <label class="year">{{ event.year }}</label>
      <div class="head">
        <label class="date">{{ event.displayDate }}</label>
        <label class="area">{{ $t(event.area) }}</label>
      </div>
      <div v-if="event.slogan" class="slogan">{{ event.slogan }}</div>
      <h3>{{ event.title }}</h3>
      <p class="loc">{{ event.loc }}</p>
      <p class="time">{{ event.time }}</p>
      <p v-if="event.time_alt" class="time_alt">{{ event.time_alt }}</p>
      <nuxt-link v-if="event.hasPage" :to="localePath({ name: 'e-id', params: { id: event.id } })">{{ PUNCT.ELLIPS }}</nuxt-link>
    </div>
  </div>
</div>
</template>

<script>
import { PUNCT } from '~/lib/const'
import allEvents from '~/data/events.json'

export default {
  props: {
    type: {
      type: String,
      default: 'conf'
    },
    series: {
      type: String,
      default: undefined
    },
    sort: {
      type: Number,
      default: -1
    },
    panelClasses: {
      type: String,
      default: ''
    }
  },
  data() {
    const events = Object.values(allEvents).filter(e => e.show && e.type === this.type).filter(e => this.series !== undefined ? e.series === this.series : true).map(e => {
      const defaultLocale = this.$i18n.defaultLocale
      const locale = this.$i18n.locale
      const localizedDoc = e.localizedDocs[e.localizedDocs[locale] ? locale : defaultLocale]
      return Object.assign(e, {
        d: new Date([e.year, e.date].join('/')),
        displayDate: e.date.replace('/', '.')
      }, localizedDoc)
    })
    events.sort((a, b) => (a.d - b.d) * this.sort)
    return {
      events,
      PUNCT
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.event-list {
  > .event {
    position: relative;
    > .detail {
      > .year {
        position: absolute;
        top: 0.5rem;
        right: 0.625rem;
        font-size: 0.75rem;
        color: var(--iorg-accent);
      }
      > .head {
        display: flex;
        align-items: center;
        > .date {
        font-size: 1.5rem;
          line-height: 1.75rem;
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
      > .loc {
        font-size: 1rem;
      }
      > .time {
        font-size: 0.85rem;
      }
    }
  }
}
</style>