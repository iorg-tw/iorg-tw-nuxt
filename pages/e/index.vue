<i18n lang="yaml">
_tw:
  confs: "會議"
  workshops: "社區工作坊"
  title: "活動"
  description: "IORG 資訊判讀、民主防衛相關活動資訊"
_en:
  confs: "Conferences"
  workshops: "Workshops"
  title: "Events"
  description: "IORG Events"
</i18n>

<template>
<div class="page events">
  <div class="section-header first">
    <p class="section-title-fancy">{{ $t('confs') }}</p>
  </div>
  <div class="event-list container">
    <div v-for="conf of displayConfs" :key="[conf.date, conf.area, conf.name].join('-')" class="conf event panel tiled filled raised">
      <div class="detail">
        <label class="year">{{ conf.year }}</label>
        <div class="head">
          <label class="date">{{ conf.displayDate }}</label>
          <label class="area">{{ conf.area }}</label>
        </div>
        <h3>{{ conf.title }}</h3>
        <p class="time">{{ conf.time }}</p>
        <nuxt-link :to="localePath({ name: 'e-id', params: { id: conf.id } })">{{ PUNCT.ELLIPS }}</nuxt-link>
      </div>
    </div>
  </div>
  <div class="section-header first">
    <p class="section-title-fancy">{{ $t('workshops') }}</p>
  </div>
  <div class="event-list container">
    <div v-for="workshop of displayWorkshops" :key="[workshop.date, workshop.area, workshop.name].join('-')" class="workshop event panel tiled compact small filled raised">
      <div class="detail">
        <label class="year">{{ workshop.year }}</label>
        <div class="head">
          <label class="date">{{ workshop.displayDate }}</label>
          <label class="area">{{ workshop.area }}</label>
        </div>
        <div class="slogan">{{ workshop.slogan }}</div>
        <h3>{{ workshop.name }}</h3>
        <h4>{{ workshop.loc }}</h4>
        <p class="time">{{ workshop.time }}</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { PUNCT } from '~/lib/const'
import { generateMeta } from '~/lib/meta'
import confs from '~/data/confs.json'
import workshops from '~/data/workshops.json'

export default {
  data() {
    return {
      confs,
      workshops,
      PUNCT
    }
  },
  computed: {
    displayConfs() {
      const displayConfs = Object.values(this.confs).filter(e => e.show).map(e => {
        const localizedDoc = e.localizedDocs[this.$i18n.locale]
        return Object.assign({
          id: e.id,
          area: e.area,
          time: e.time,
          d: new Date([e.year, e.date].join('/')),
          year: e.year,
          displayDate: e.date.replace('/', '.')
        }, localizedDoc)
      })
      displayConfs.sort((a, b) => b.d - a.d)
      return displayConfs
    },
    displayWorkshops() {
      return this.workshops.filter(e => e.show).map(e => ({
        ...e,
        d: new Date([e.year, e.date].join('/')),
        year: e.year,
        displayDate: e.date.replace('/', '.')
      }))
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
        > .time {
          font-size: 0.85rem;
        }
      }
    }
  }
}
</style>
