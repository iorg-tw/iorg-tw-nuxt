<template>
<div class="page">
  <div class="section-header">
    <h1>B</h1>
    <div v-for="node of nodes" :key="node.id">{{ node }}</div>
  </div>
  <div></div>
</div>
</template>

<script>
import { tree } from '~/data/research'

const B_ID = '_R_B'

export default {
  data() {
    const nodes = tree.filter(node => node.parentID === B_ID)
    return {
      nodes
    }
  }
}

</script>
