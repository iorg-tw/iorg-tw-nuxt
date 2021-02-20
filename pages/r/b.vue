<template>
<div class="page">
  <div class="section-header">
    <h1>B</h1>
    <div v-for="c of cases" :key="c.id">{{ c }}</div>
  </div>
  <div></div>
</div>
</template>

<script>
import { tree } from '~/data/research'

const B_ID = '_R_B'

export default {
  data() {
    const cases = tree.filter(i => i.parentID === B_ID)
    return {
      cases
    }
  }
}

</script>
