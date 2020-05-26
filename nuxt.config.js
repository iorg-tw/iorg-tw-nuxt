const config = require('./config.js')

export default {
  mode: 'universal',
  head: {
    title: config.title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: config.description },
      { name: 'og:image', property: 'og:image', content: config.cover }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/images/logo-tmp-small.png' }
    ]
  },
  loading: { color: '#fff' },
  css: [],
  plugins: [],
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  modules: [],
  build: {
    extend(config, ctx) {}
  },
  generate: {
    dir: 'docs'
  }
}
