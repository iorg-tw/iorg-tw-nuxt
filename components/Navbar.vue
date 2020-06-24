<template>
<div class="navbar">
  <nuxt-link class="go-home" :to="{ path: '/' }">
    <img src="/images/logo-tmp-small.png" width="64" />
  </nuxt-link>
  <div class="menu">
    <nuxt-link :to="{ path: '/' }" class="item"><span>Reports</span></nuxt-link>
    <nuxt-link :to="{ name: 'a' }" class="item"><span>Articles</span></nuxt-link>
  </div>
</div>
</template>

<style lang="scss">
$size: 64px;
.navbar {
  display: flex;
  > .go-home {
    flex-grow: 0;
    flex-shrink: 0;
    width: $size;
  }
  > .menu {
    display: flex;
    margin: 0 0.5rem;
    > .item {
      display: block;
      padding: 0 0.5rem;
      line-height: $size;
      color: var(--iorg-primary-dark-color);
      > span {
        line-height: 1.5;
        border-bottom: 2px solid var(--iorg-primary-dark-color);
      }
    }
  }
}
</style>
