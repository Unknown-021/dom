module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'eslint-config-standard',
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended'
  ],
  globals: {
    ym: 'readonly'
  },
  plugins: [
  ],
  // add your custom rules here
  rules: {
    /* 'no-console': false, */
    'require-await': [0],
    'no-case-declarations': [0],
    camelcase: [0],
    'vue/no-v-html': [0],
    'no-dupe-class-members': [0]
  }
}
