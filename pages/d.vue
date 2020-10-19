<template>
<div class="page download">
  <div class="container">
    <div class="target panel">
      <a class="primary-action block" :href="target.action.url">
        <img :src="target.image" />
        <label :href="target.action.url">{{ target.action.label }}</label>
      </a>
      <h2>{{ target.title }}</h2>
      <p class="description">{{ target.description }}</p>
    </div>
  </div>
</div>
</template>

<script>
import home from '~/data/home.js'

const targetID = 'model-2-tw'

export default {
  data() {
    const target = home.reports.filter(r => r.id === targetID)[0]
    target.action = target.actions[0]
    return {
      target
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.download {
  .target {
    .primary-action {
      position: relative;
      border-radius: 0.25rem;
      overflow: hidden;
      background-color: white;
      > img {
        width: 100%;
      }
      > label {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.5rem;
        background-color: var(--iorg-primary-dark-color);
        color: var(--iorg-primary-light-color);
        line-height: 1;
        padding: 0.75em 1em;
        border-radius: 1.25em;
        cursor: pointer;
        @include shadow;
      }
    }
    h2 {
      margin: 0.375rem 0 0.125rem;
      font-size: 1.25rem;
    }
    .description {
      font-size: 0.875rem;
    }
  }
}
</style>
