<template>
<div class="page">
  <div class="section-header">
    <h1>D</h1>
    <div v-for="c of cases" :key="c.id">{{ c }}</div>
  </div>
  <div></div>
</div>
</template>

<script>
import { tree } from '~/data/research'

const D_ID = '_R_D'

export default {
  data() {
    const cases = tree.filter(i => i.parentID === D_ID)
    return {
      cases
    }
  }
}

</script>
