module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    'arrow-parens': 0,
    'keyword-spacing': 0,
    'no-unneeded-ternary': 0,
    'space-before-function-paren': ['error', 'never'],
    'vue/comment-directive': 0,
    'vue/html-indent': 0,
    'vue/html-self-closing': 0,
    'vue/no-v-html': 0,
    'vue/singleline-html-element-content-newline': 0
  }
}
