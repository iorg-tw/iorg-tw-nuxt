<template>
<div class="page research">
  <div class="section-header">
    <h1>{{ CONST.code }} {{ $t(CONST.id) }}</h1>
  </div>
  <node-list :nodes="nodes" />
</div>
</template>

<script>
import { tree, defaultCover } from '~/data/research'
import NodeList from '~/components/NodeList'

const CONST = {
  id: '_R_B',
  code: 'B'
}

export default {
  components: {
    NodeList
  },
  data() {
    const nodes = tree.filter(node => node.parentID === CONST.id)
    return {
      nodes,
      defaultCover,
      CONST
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.research {
  padding: $default-page-padding;
}
</style>
