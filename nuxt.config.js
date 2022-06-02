const config = require('./data/config.js')

export default {
  head: {
    title: config.title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: config.description },
      { hid: 'og-type', name: 'og:image', property: 'og:image', content: config.cover }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/images/logo-2022-fill.png' }
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
    port: process.env.PORT,
    host: process.env.HOST
  },
  i18n: {
    lazy: true,
    langDir: '~/locales/',
    locales: config.locales,
    defaultLocale: config.defaultLocale,
    strategy: 'prefix_except_default',
    vueI18nLoader: true,
    vueI18n: {
      silentTranslationWarn: true,
      silentFallbackWarn: true,
      fallbackLocale: config.localeFallbackMap
    }
  }
}
