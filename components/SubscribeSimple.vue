<template>
<div class="subscribe-simple">
  <p v-if="context === 'default'" class="description">留下 Email，訂閱 <span class="dokidoki">IORG 資訊操弄心<span class="doki">慌</span>週報</span>。</p>
  <p v-else-if="context === 'article'" class="description">感謝你閱讀這一期的 <span class="dokidoki">IORG 資訊操弄心<span class="doki">慌</span>週報</span>。<br>覺得不錯嗎？留下 Email 就可以訂閱囉 <span class="yes">✌️</span></p>
  <div class="form-container">
    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLScW5xxLe4cxfyoXpue2VSWrv0WdZByr6YfwoR8iQD70MOKsXg/viewform"></iframe>
  </div>
  <p class="privacy">基於隱私保護，你的 Email 僅供 IORG 寄送心慌週報使用，絕不轉作其他用途，絕不轉交其他人。如果你不想再收到 IORG 心慌週報，請隨時寄信至 bye@iorg.tw 取消訂閱，非常感謝。</p>
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
  > .description {
    margin-bottom: 0.25rem;
  }
  > .form-container {
    width: 100%;
    height: 300px;
    outline: 2px solid var(--iorg-accent);
    margin: 0.5rem 0;
    border-radius: 4px;
    overflow: hidden;
    > iframe {
      width: 320px + 24px;
      height: 385px;
      border: 0;
      margin-left: 0px;
      margin-top: -85px;
    }
  }
  > .privacy {
    margin-top: 0.25rem;
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
  .privacy {
    font-size: 0.875rem;
  }
}

</style>
