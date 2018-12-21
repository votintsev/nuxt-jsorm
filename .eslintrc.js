module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'eslint:recommended',
    'plugin:vue/recommended'
  ],
  // required to lint *.vue files
  plugins: ['vue', 'ejs', 'import'],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/no-unresolved': 'off',
    'import/no-unassigned-import': 'off',
    'vue/no-v-html': 'off',
    semi: ['error', 'never'],
    'vue/max-attributes-per-line': [2, {
      singleline: 2,
      multiline: {
        max: 1,
        allowFirstLine: false
      }
    }],
    'no-console': 'off',
    'vue/component-name-in-template-casing': ['error',
      'kebab-case',
      {
        ignores: []
      }
    ],
    'vue/html-indent': ['error', 2, {
      attribute: 1,
      baseIndent: 0,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: []
    }]
  }
}
