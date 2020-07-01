<template>
<main>
  <navbar />
  <nuxt />
</main>
</template>

<script>
import Navbar from '~/components/Navbar'

export default {
  components: {
    Navbar
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

:root {
  --iorg-primary-dark-color: #1E1E1E;
  --iorg-primary-light-color: #EEE;
}
html, body {
  font-family: "system-ui", "-apple-system", "BlinkMacSystemFont", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  background-color: var(--iorg-primary-light-color);
  color: var(--iorg-primary-dark-color);
  margin: 0;
  font-size: 16px;
  line-height: 1.375;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}
* {
  &, &:before, &:after {
    box-sizing: border-box;
    margin: 0;
  }
}
a {
  text-decoration: none;
  &, &:active, &:visited {
    color: blue;
  }
}
img {
  display: block;
}
h1, h2, h3, h4, h5, h6 {
  line-height: 1.35;
}
h1 {
  font-size: 2rem;
}
h2 {
  font-size: 1.5rem;
}
h3 {
  font-size: 1.25rem;
}

// line height
.lh-single {
  line-height: 1;
}
.lh-tight {
  line-height: 1.25;
}
.lh-compact {
  line-height: 1.375;
}
.lh-default {
  line-height: 1.5;
}
.lh-relaxed {
  line-height: 1.75;
}
</style>
