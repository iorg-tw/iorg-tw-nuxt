<template>
<div class="nodes container">
  <div v-for="node of nodes" :key="node.id" class="node panel tiled" :class="nodeClasses">
    <img class="cover" :src="node.image" />
    <div class="detail">
      <p v-if="node.code">{{ node.code }}</p>
      <nuxt-link :to="localePath(node.path)">{{ $t(node.id) }}</nuxt-link>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    nodes: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    nodeClasses() {
      const keys = ['tiled']
      return Object.assign({}, ...keys.map(k => ({ [k]: this.options[k] })))
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.nodes {
  > .node {
    position: relative;
    display: flex;
    align-items: flex-start;
    > .cover {
      width: 120px;
      border-radius: 0.75rem;
      @include shadow;
    }
    > .detail {
      padding: 0;
      padding-left: 0.75rem;
      > a {
        font-weight: bold;
      }
    }
  }
}
</style>
