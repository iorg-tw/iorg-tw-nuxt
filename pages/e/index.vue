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
    <div v-for="conf of displayConfs" :key="[conf.date, conf.area, conf.name].join('-')" class="conf event panel tiled compact small filled raised">
      <div class="detail">
        <div class="head">
          <label class="date">{{ conf.displayDate }}</label>
          <label class="area">{{ conf.area }}</label>
        </div>
        <h3><nuxt-link :to="localePath({ name: 'e-id', params: { id: conf.id } })">{{ conf.title }}</nuxt-link></h3>
        <p>{{ conf.time }}</p>
      </div>
    </div>
  </div>
  <div class="section-header first">
    <p class="section-title-fancy">{{ $t('workshops') }}</p>
  </div>
  <div class="event-list container">
    <div v-for="workshop of displayWorkshops" :key="[workshop.date, workshop.area, workshop.name].join('-')" class="workshop event panel tiled compact small filled raised">
      <div class="detail">
        <div class="head">
          <label class="date">{{ workshop.displayDate }}</label>
          <label class="area">{{ workshop.area }}</label>
        </div>
        <div class="slogan">{{ workshop.slogan }}</div>
        <h3>{{ workshop.name }}</h3>
        <h4>{{ workshop.loc }}</h4>
        <p>{{ workshop.time }}</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { generateMeta } from '~/lib/meta'
import confs from '~/data/confs.json'
import workshops from '~/data/workshops.json'

export default {
  data() {
    return {
      confs,
      workshops
    }
  },
  computed: {
    displayConfs() {
      return Object.values(this.confs).filter(e => e.show).map(e => {
        const localizedDoc = e.localizedDocs[this.$i18n.locale]
        return Object.assign({
          id: e.id,
          area: e.area,
          time: e.time,
          d: new Date([e.year, e.date].join('/')),
          displayDate: e.date.replace('/', '.')
        }, localizedDoc)
      })
    },
    displayWorkshops() {
      return workshops.filter(e => e.show).map(e => ({
        ...e,
        d: new Date([e.year, e.date].join('/')),
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
      > .detail {
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
      }
    }
  }
}
</style>
