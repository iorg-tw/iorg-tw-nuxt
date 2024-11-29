const config = {
  title: '台灣資訊環境研究中心 IORG',
  description: 'IORG 基於資料證據、科學研究，透過校園教育、公眾溝通，形塑國際社會對華語資訊環境的共有理解，強化台灣民主社會的信任及韌性',
  cover: 'https://iorg.tw/images/cover-2-1-2023.png',
  locales: [
    {
      code: '_tw',
      iso: 'zh-Hant-TW',
      name: '華',
      nameType: 'text',
      file: 'tw.json'
    },
    {
      code: '_en',
      iso: 'en-US',
      name: 'EN',
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
