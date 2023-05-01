<i18n lang="json">
{
  "_tw": {
    "sub": "留下 Email 訂閱電子報，追蹤 IORG 最新研究成果。",
    "sub_after_article": "感謝你的閱讀。<br>覺得不錯嗎？留下 Email 就可以訂閱囉 <span class=yes>✌️</span>",
    "privacy": "基於隱私保護，你的 Email 僅供 IORG 寄送電子報使用，絕不轉作他用，絕不轉交他人。如果你不想再收到 IORG 電子報，請隨時寄信至 bye [at] iorg.tw 取消訂閱，非常感謝。"
  },
  "_en": {
    "sub": "Subscribe to IORG Newsletter for our latest research findings.",
    "sub_after_article": "Thank you for reading this article. Like it? Please subscribe <span class=yes>✌️</span>",
    "privacy": "To protect your privacy, your email will only be used to send you our newsletters. It will not be used for any other purpose, nor will it be available to anyone outside IORG. If you want to unsubscribe, please email us anytime at bye [at] iorg.tw. Thank you."
  }
}
</i18n>

<template>
<div class="subscribe-simple">
  <p v-if="context === 'default'" class="description" v-html="$t('sub')"></p>
  <p v-else-if="context === 'article'" class="description" v-html="$t('sub_after_article')"></p>
  <div class="form-container">
    <iframe src="https://www.surveycake.com/s/xxPap" allowTransparency="true"></iframe>
  </div>
  <p class="privacy">{{ $t('privacy') }}</p>
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
  $y1: 20px;
  $y2: -8px;
  $h: 180px;
  > .form-container {
    width: 100%;
    height: $h + $y1;
    margin: 0.5rem 0;
    border-radius: 0.75rem;
    box-shadow: 0 0 0 2px var(--iorg-accent); // instead of outline
    transform: translateX(0); // HACK!
    overflow: hidden;
    > iframe {
      $t: 138px; // scroll top
      width: 360px;
      height: $h + $t + $y1 - $y2;
      margin-top: -$t + $y2;
      margin-left: 0px;
      border: 0;
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
