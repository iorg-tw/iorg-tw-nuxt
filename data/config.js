const config = {
  title: 'IORG 台灣資訊環境研究中心',
  description: 'IORG studies Taiwan’s information environment and defends Taiwan’s democracy.',
  cover: 'https://iorg.tw/images/cover-2-1.png',
  locales: [
    {
      code: '_tw',
      iso: 'zh-Hant-TW',
      name: '台',
      file: 'tw.json'
    },
    {
      code: '_en',
      iso: 'en-US',
      name: 'En',
      file: 'en.json'
    },
    {
      code: '_ua',
      iso: 'ua',
      name: 'Ук',
      file: 'ua.json'
    }
  ],
  defaultLocale: '_tw',
  localeFallbackMap: {
    _ua: ['_en', '_tw'],
    _en: ['_tw'],
    _tw: ['_tw']
  }
}

module.exports = config
