<template>
<div class="subscribe-simple">
  <p v-if="context === 'default'">留下 Email，訂閱 <span class="dokidoki">IORG 資訊操弄心<span class="doki">慌</span>週報</span>。</p>
  <p v-else-if="context === 'article'">感謝你閱讀這一期的 <span class="dokidoki">IORG 資訊操弄心<span class="doki">慌</span>週報</span>。<br>覺得不錯嗎？留下 Email 就可以訂閱囉 <span class="yes">✌️</span></p>
  <div class="form-container">
    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLScW5xxLe4cxfyoXpue2VSWrv0WdZByr6YfwoR8iQD70MOKsXg/viewform"></iframe>
  </div>
</div>
</template>

<script>
export default {
  props: {
    context: {
      type: String,
      default: 'default'
    }
  }
}
</script>

<style lang="scss">
.subscribe-simple {
  width: 320px;
  > .form-container {
    width: 100%;
    height: 225px;
    outline: 2px solid var(--iorg-accent);
    margin: 0.5rem 0;
    border-radius: 4px;
    overflow: hidden;
    > iframe {
      width: 320px + 24px;
      height: 385px;
      border: 0;
      margin-left: 0px;
      margin-top: -160px;
    }
  }
}
.doki {
  position: relative;
  top: -0.25rem;
}
.dokidoki {
  display: inline-block;
  margin-top: 0.25rem;
  font-weight: bold;
}
.yes {
  display: inline-block;
  vertical-align: middle;
  margin-left: -0.125rem;
  font-size: 1.5rem;
}
</style>
