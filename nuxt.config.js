const config = require('./data/config.js')

export default {
  mode: 'universal',
  head: {
    title: config.title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: config.description },
      { hid: 'og-type', name: 'og:image', property: 'og:image', content: config.cover }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/images/logo-tmp-small-fill.png' }
    ]
  },
  loading: {
    color: '#1E1E1E',
    height: '4px'
  },
  css: [],
  plugins: [],
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/gtm'
  ],
  gtm: {
    id: 'GTM-MS5KXKS'
  },
  modules: [
    '@nuxtjs/markdownit',
    'nuxt-i18n'
  ],
  serverMiddleware: [
    '~/servermiddleware/301.js'
  ],
  markdownit: {
    injected: true
  },
  build: {
    extend(config, ctx) {}
  },
  server: {
    port: 10101,
    host: '0.0.0.0'
  },
  i18n: {
    lazy: true,
    langDir: '/locales/',
    locales: [
      {
        code: '_en',
        name: 'En',
        file: 'en.js'
      },
      {
        code: '_tw',
        name: '台',
        file: 'tw.js'
      }
    ],
    defaultLocale: '_tw',
    strategy: 'prefix_except_default',
    vueI18nLoader: true
  }
}
