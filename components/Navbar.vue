<template>
<div class="navbar">
  <nuxt-link class="go-home" :to="{ path: '/' }">
    <img src="/images/logo-tmp-small.png" width="64" />
  </nuxt-link>
  <div class="space"></div>
</div>
</template>

<style lang="scss">
.navbar {
  display: flex;
  > .go-home {
    flex-grow: 0;
    flex-shrink: 0;
    width: 64px;
  }
}
</style>
