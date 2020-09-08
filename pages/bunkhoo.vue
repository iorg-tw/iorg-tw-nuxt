<template>
<div class="page articles">
  <article-list type="all" :show-all="true" />
</div>
</template>

<script>
import ArticleList from '~/components/ArticleList'

export default {
  components: {
    ArticleList
  }
}
</script>
