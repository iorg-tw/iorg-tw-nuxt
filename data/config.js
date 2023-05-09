const config = {
  title: '台灣資訊環境研究中心 IORG',
  description: '專注資訊環境相關跨領域科學研究、科技研發、公眾溝通，推動校園教育、社區教育，強化民主韌性，反制威權擴張',
  cover: 'https://iorg.tw/images/cover-2-1-2023.png',
  locales: [
    {
      code: '_tw',
      iso: 'zh-Hant-TW',
      name: '華語',
      nameType: 'text',
      file: 'tw.json'
    },
    {
      code: '_en',
      iso: 'en-US',
      name: 'Eng',
      nameType: 'text',
      file: 'en.json'
    },
    {
      code: '_ua',
      iso: 'ua',
      name: '🇺🇦',
      nameType: 'flag',
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
