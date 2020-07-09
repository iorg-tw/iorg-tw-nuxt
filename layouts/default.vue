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
@import '~assets/styles/common';

:root {
  --iorg-primary-dark-color: #1E1E1E;
  --iorg-primary-light-color: #EEE;
  --iorg-text: #303030;
  --iorg-paper: #F5F5F5;
  --iorg-background: #D0D0D0;
}
html, body {
  font-family: "system-ui", "-apple-system", "BlinkMacSystemFont", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  background-color: var(--iorg-background);
  color: var(--iorg-text);
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
  &:not(.block) {
    display: inline;
    border-bottom: 2px solid blue;
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
label {
  margin: 0;
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

// tracking optimization
span.punct-l-fbrac {
  margin-left: -0.5em;
}
</style>
