<i18n lang="yaml">
_tw:
  publishedAt: "發布"
  updatedAt: "更新"
  more: "更多⋯"
  all: "全部"
_en:
  publishedAt: "Published"
  updatedAt: "Updated"
  more: "More…"
  all: "All"
</i18n>

<template>
<div class="article-list container-wrapper">
  <div v-if="showFilter" class="filter">
    <a class="button small" :class="{ 'active': !filterIsActive }" @click="resetFilter">{{ $t('all') }}</a><a v-for="(selected, tag) in tagSelection" :key="tag" class="button small" :class="{ 'active': selected }" @click="toggleTag(tag)">{{ $t(`tag_${tag}`) }}</a>
  </div>
  <div class="articles container">
    <template v-for="(panel, panelIndex) of panelsInRange">
      <div v-if="['links'].includes(panel.type) && panel.show" :key="panelIndex" class="panel tiled xlarge">
        <link-list group="home" />
      </div>
      <nuxt-link v-if="['article', 'featured'].includes(panel.type) && panel.show" :key="panelIndex" :to="localeRoute(panel.data.path ? { path: panel.data.path } : { name: 'a-id', params: { id: panel.data.id } })" class="article block panel tiled filled" :class="articleClasses">
        <img v-if="getLocalizedDoc(panel.data).coverImage" :src="getLocalizedDoc(panel.data).coverImage" class="cover" />
        <div class="detail">
          <h3 v-html="optimizeTracking(getLocalizedDoc(panel.data).title)"></h3>
          <h4 v-if="getLocalizedDoc(panel.data).subtitle">{{ getLocalizedDoc(panel.data).subtitle }}</h4>
          <div class="dates">
            <div v-if="panel.data.publishedAt" class="published-at">{{ $t('publishedAt') }} = {{ panel.data.publishedAt.replace(/\//g, '.') }}</div>
            <div v-if="panel.data.updatedAt" class="updated-at">{{ $t('updatedAt') }} = {{ panel.data.updatedAt.replace(/\//g, '.') }}</div>
          </div>
        </div>
      </nuxt-link>
      <div v-if="['sub'].includes(panel.type) && panel.show" :key="panelIndex" class="panel tiled">
        <subscribe-simple />
      </div>
    </template>
    <div v-if="panelsInRange.length < panelsToShow.length" key="more" class="panel tiled">
      <a class="button action average" @click="currentListRange += pageSize">{{ $t('more') }}</a>
    </div>
  </div>
</div>
</template>

<script>
import { optimizeTracking } from '~/lib/typography'
import { localizeArticle } from '~/lib/i18n'
import allArticles from '~/data/articles.json'
import LinkList from '~/components/LinkList'
import SubscribeSimple from '~/components/SubscribeSimple'

export default {
  components: {
    LinkList,
    SubscribeSimple
  },
  props: {
    type: {
      type: String,
      default: 'article' // types = article research da eval sys profile
    },
    features: {
      type: String,
      default: ''
    },
    firstPageSize: {
      type: Number,
      default: 8
    },
    pageSize: {
      type: Number,
      default: 9
    }
  },
  data() {
    const showHomeLinks = this.features.includes('show-home-links')
    const showFeaturedArticles = this.features.includes('show-featured-articles')
    const showAll = this.features.includes('show-all')
    const showSub = this.features.includes('show-sub')
    const showFilter = this.features.includes('show-filter')
    const articleClasses = []
    if(this.type === 'da') {
      articleClasses.push('xlarge')
    }

    let computedType = this.type
    if(showAll) {
      computedType = 'article da eval video research sys'
    }
    const keys = Object.keys(allArticles)
    const articles = keys.filter(k => allArticles[k].show && computedType.includes(allArticles[k].type)).map(k => allArticles[k])
    const featuredArticles = keys.filter(k => allArticles[k].featured).map(k => allArticles[k])

    const panels = []
    if(showHomeLinks) {
      panels.push({ type: 'links', show: true })
    }
    if(showFeaturedArticles) {
      panels.push(...featuredArticles.map(a => ({ type: 'featured', data: a })))
    }
    if(articles.length > 0) {
      panels.push({ type: 'article', data: articles[0], show: true })
      if(showSub) {
        panels.push({ type: 'sub' })
      }
      for(let i = 1; i < articles.length; i++) {
        panels.push({ type: 'article', data: articles[i], show: true })
      }
    }

    const tagSelection = Object.assign({}, ...articles
      .map(a => a.tags ? a.tags.split(' ').filter(t => t.trim().length > 0) : []) // extract tags
      .reduce((a, v) => a.concat(v), []) // flatten array
      .filter((v, i, a) => a.indexOf(v) === i) // unique
      .map(t => ({ [t]: false }))
    )

    const currentListRange = this.firstPageSize

    return {
      showHomeLinks,
      showFeaturedArticles,
      showAll,
      showSub,
      showFilter,
      panels,
      articleClasses,
      tagSelection,
      currentListRange
    }
  },
  computed: {
    panelsInRange() {
      return this.panels.filter(p => p.show).slice(0, this.currentListRange)
    },
    panelsToShow() {
      return this.panels.filter(p => p.show)
    },
    filterIsActive() {
      return Object.values(this.tagSelection).reduce((a, v) => (+a) + (+v)) > 0
    }
  },
  methods: {
    optimizeTracking,
    getLocalizedDoc(article) {
      return localizeArticle(article, this.$i18n.locale)
    },
    toggleTag(tag) {
      Object.keys(this.tagSelection).forEach(t => { this.tagSelection[t] = t === tag ? !this.tagSelection[t] : false })
      if(this.filterIsActive) {
        this.togglePanelVisibility()
      } else {
        this.resetFilter()
      }
    },
    togglePanelVisibility() {
      for(const panel of this.panels) {
        if(panel.type === 'article') {
          const article = panel.data
          const tags = article.tags ? article.tags.split(' ').filter(t => t.trim().length > 0) : []
          const visible = tags.reduce((acc, tag) => acc || this.tagSelection[tag], false)
          panel.show = visible
        }
      }
      this.currentListRange = this.firstPageSize
    },
    resetFilter() {
      Object.keys(this.tagSelection).forEach(t => { this.tagSelection[t] = false })
      for(const panel of this.panels) {
        panel.show = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/resources';

.article-list {
  .filter {
    margin: 0.5rem 1.5rem 0;
    .button {
      margin-right: 0.25rem;
      &.active {
        background-color: var(--iorg-paper);
      }
    }
  }
  .article {
    > .detail {
      > h3 {
        font-size: 1.125rem;
      }
      > h4 { // subtitle
        margin: 0.125rem 0;
        font-size: 0.75rem;
        font-weight: normal;
        color: var(--iorg-accent);
      }
      > .dates {
        margin: 0.25rem 0 0.125rem;
        font-size: 0.75rem;
        color: var(--iorg-neutral);
      }
    }
  }
  .panel {
    &.more {
      padding: 1rem;
      cursor: pointer;
    }
  }
}
</style>
