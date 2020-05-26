<template>
<main>
  <nuxt />
</main>
</template>

<style lang="scss">
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
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
* {
  &, &:before, &:after {
    box-sizing: border-box;
    margin: 0;
  }
}
a {
  text-decoration: none;
}
img {
  display: block;
}
</style>
