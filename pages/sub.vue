<template>
<div class="page subscribe">
  <subscribe-simple />
</div>
</template>

<script>
import { generateMeta } from '~/lib/meta'
import SubscribeSimple from '~/components/SubscribeSimple'

export default {
  components: {
    SubscribeSimple
  },
  head() {
    return generateMeta('訂閱 IORG 電子報')
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';

.page.subscribe {
  > .subscribe-simple {
    margin: 0 auto;
  }
}
</style>
