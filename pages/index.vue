<template>
<div class="page index">
  <img src="/images/logo-tmp-small.png" width="64" />
  <section class="reports">
    <div class="container">
      <div class="panel report" v-for="report of reports" :key="report.title">
        <a class="cover" :href="report.url"><img :src="report.image" /></a>
        <h2>{{ report.title }}</h2>
        <a class="action" :href="report.url"><label>{{ report.action }}</label></a>
      </div>
    </div>
  </section>
  <section class="text description">
    <p>{{ description }}</p>
  </section>
  <section class="text intro">
    <p>{{ intro }}</p>
  </section>
  <section class="people">
    <div class="section-header"><span>{{ peopleSectionHeader }}</span></div>
    <div class="container">
      <div class="panel person" v-for="person of people" :key="person.name">
        <h2>{{ person.name }}</h2>
        <div>{{ person.description }}</div>
      </div>
    </div>
  </section>
  <section class="contact">
    <div class="container">
      <div class="panel">
        <p>Contact us at io [at] iorg.tw. Follow us on Twitter on <a href="https://twitter.com/iorgtw" target="_blank">@iorgtw</a>.</p>
      </div>
    </div>
  </section>
</div>
</template>

<script>
import config from '~/config.js'

export default {
  data() {
    return Object.assign({}, config)
  }
}
</script>

<style lang="scss">
.action {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0 0;
  > label {
    background-color: var(--iorg-primary-dark-color);
    color: var(--iorg-primary-light-color);
    line-height: 1;
    padding: 0.75rem 1rem;
    border-radius: 1.25rem;
    cursor: pointer;
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
  &.people {}
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
    border-bottom: 2px solid var(--iorg-primary-dark-color);
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
    background-color: white;
    box-shadow: 0 0.5rem 3rem 0 rgba(0, 0, 0, 0.25);
  }
}
.person {
  > h2 {
    margin: 0.12rem 0;
    font-size: 1.25rem;
    font-weight: bold;
  }
}
</style>
