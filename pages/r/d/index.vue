<template>
<div class="page">
  <div class="section-header">
    <h1>D</h1>
  </div>
  <div></div>
</div>
</template>

<script>
import { cases as allCases } from '~/data/research'
export default {
  data() {
    const cases = allCases.filter(c => c.id.startsWith('D'))
    return {
      cases
    }
  }
}

</script>
