<template>
<main>
  <navbar />
  <nuxt />
  <Foooter />
</main>
</template>

<script>
import Navbar from '~/components/Navbar'
import Foooter from '~/components/Footer'

export default {
  components: {
    Navbar,
    Foooter
  },
  head() {
    let locale = this.$i18n.locales.filter(loc => loc.code === this.$i18n.locale)
    locale = locale.length > 0 ? locale[0] : null
    return {
      htmlAttrs: {
        ...(locale ? { lang: locale.iso } : {})
      }
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/resources';
@import '~assets/styles/common';

:root {
  --iorg-primary-dark-color: #1E1E1E;
  --iorg-primary-light-color: #EEE;
  --iorg-text: #303030;
  --iorg-paper: #F5F5F5;
  --iorg-background: #D0D0D0;
  --iorg-background-code: #DFDFDF;
  --iorg-neutral: #808080;
  --iorg-accent: #2CD086;
  --iorg-alert: #FFCB00;
  --iorg-bad: #FF8F00;
  --iorg-danger: #FF2828;
  --iorg-accent-tr: rgb(from #2CD086 r g b / 0.35);
  --iorg-alert-tr: rgb(from #FFCB00 r g b / 0.35);
  --iorg-bad-tr: rgb(from #FF8F00 r g b / 0.35);
  --iorg-danger-tr: rgb(from #FF2828 r g b / 0.35);
  --iorg-max: #2CD086;
  --iorg-min: #FF2828;

  --fb: #3C30F4;
  --wb: #FF3232;
  --ccp: #FF6464;
  --ccp-affiliated: #FFA4A4;
  --china: #FFA4A4;

  --kmt: #C0C0FF;
  --dpp: #99FF99;
  --pfp: #FFCF78;
  --np: #FFFF64;

  & {
    --facebook: #5252FF;
    --weibo: #ff5656;
    --line: #40DD40;
    --ccp-media: #FF6464;
    --gdoc-post-post: "Post";
    --gdoc-post-facebook: "Facebook";
    --gdoc-post-weibo: "Weibo";
    --gdoc-post-line: "LINE";
    --gdoc-post-ccp-media: "CCP";
    --gdoc-post-mail: "Mail";
    --gdoc-post-handle-show: "More";
    --gdoc-post-handle-hide: "Less";
  }
  &[lang="zh-Hant-TW"] {
    --gdoc-post-post: "文章";
    --gdoc-post-facebook: "Facebook";
    --gdoc-post-weibo: "微博";
    --gdoc-post-line: "LINE";
    --gdoc-post-ccp-media: "中共";
    --gdoc-post-mail: "信件";
    --gdoc-post-handle-show: "展開";
    --gdoc-post-handle-hide: "收合";
  }
}
</style>
