<template>
<div class="page index">
  <section class="reports">
    <div class="container">
      <div v-for="report of reports" :key="report.title" class="panel report">
        <a class="cover block" :href="report.url"><img :src="report.image" /></a>
        <h2>{{ report.title }}</h2>
        <div v-for="(action, actionIndex) of report.actions" :key="action.label" class="action" :class="actionIndex < 1 ? ['primary'] : []">
          <a :href="action.url" class="block">{{ action.label }}</a>
        </div>
      </div>
    </div>
  </section>
  <section class="text description">
    <p v-html="$md.render(description)"></p>
  </section>
  <section class="text intro">
    <p>{{ intro }}</p>
  </section>
  <section class="contact">
    <div class="container">
      <div class="panel">
        <p>For more information about IORG: <nuxt-link to="/about">About us</nuxt-link>. Contact us at <a href="#">io [at] iorg.tw</a>. Follow us on Twitter at <a href="https://twitter.com/iorgtw" target="_blank">@iorgtw</a>.</p>
      </div>
    </div>
  </section>
</div>
</template>

<script>
import config from '~/data/config.js'
import home from '~/data/home.js'

export default {
  data() {
    return Object.assign({}, config, home)
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.action {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5rem 0 0;
  & > a {
    color: var(--iorg-text);
    padding: 0.25rem 0.5rem;
    cursor: pointer;
  }
  &.primary > a {
    background-color: var(--iorg-primary-dark-color);
    color: var(--iorg-primary-light-color);
    line-height: 1;
    padding: 0.75rem 1rem;
    border-radius: 1.25rem;
  }
}
section {
  &.reports {}
  &.description {
    padding: 2.5rem;
    background-color: var(--iorg-primary-dark-color);
    font-size: 2.25rem;
    color: var(--iorg-primary-light-color);
  }
  &.intro {
    padding: 2rem 1.5rem 0;
    font-size: 1.125rem;
    line-height: 1.375;
  }
  &.contact {
    padding: 2.5rem 0;
  }
  &.text {
    > p {
      max-width: 40rem;
    }
  }
}
.section-header {
  margin: 2rem 1.5rem 0;
  font-size: 1.125rem;
  font-weight: bold;
  > span {
    border-bottom: 2px solid var(--iorg-text);
  }
}
.section-intro {
  margin: 2rem 1.5rem 0;
  font-size: 1.125rem;
  font-weight: bold;
}
.container {
  display: flex;
  flex-wrap: wrap;
  margin: 0.5rem;
  max-width: 60rem;
  > .panel {
    max-width: 20rem;
    margin: 1rem;
  }
}
.section-header + .container {
  margin-top: 0;
}
.report {
  margin: 2rem;
  > h2 {
    margin: 0.5rem 0.125rem 0;
    font-family: serif;
    font-size: 1rem;
    font-weight: normal;
    font-style: italic;
  }
  > .cover {
    display: block;
    width: 100%;
    > img {
      width: 100%;
    }
    border-radius: 0.25rem;
    overflow: hidden;
    background-color: white;
    @include shadow;
  }
}
</style>
