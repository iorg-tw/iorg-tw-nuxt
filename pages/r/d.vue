<template>
<div class="page">
  <div class="section-header">
    <h1>D</h1>
    <div v-for="node of nodes" :key="node.id">{{ node }}</div>
  </div>
  <div></div>
</div>
</template>

<script>
import { tree } from '~/data/research'

const D_ID = '_R_D'

export default {
  data() {
    const nodes = tree.filter(node => node.parentID === D_ID)
    return {
      nodes
    }
  }
}

</script>
