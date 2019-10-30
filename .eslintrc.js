const path = require('path');

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 9,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    },
    parser: "@typescript-eslint/parser"
  },
  env: {
    node: true,
    es6: true,
    browser: true
  },
  plugins: [
    "import"
  ],
  extends: [
    "eslint:recommended",
    "plugin:vue/recommended",
    "plugin:import/errors"
  ],
  settings: {
    "import/resolver": {
      webpack: {
        config: path.resolve(__dirname, "compile/webpack.base.js") // 解析webpack配置
      },
      typescript: {
        
      }
    }
  },
  rules: {
    "import/no-unresolved": [2, { commonjs: true, amd: true }],
    "import/named": 0,
    "vue/attribute-hyphenation": 0,
    "vue/html-self-closing": 0,
    "vue/max-attributes-per-line": 0,
    "vue/no-v-html": 0,
    "vue/singleline-html-element-content-newline": 0,
    "no-console": 0,
    "semi": [2, "always"],
    "indent": ["error", 2],
    "comma-dangle": [ 2, "never"],
    "no-unused-vars": 0,
    "no-var": 2,
    "no-trailing-spaces": 2,
    "eol-last": 2,
    "comma-spacing": 2,
    "space-infix-ops": 2,
    "quotes": ["error", "single"],
    "no-multi-spaces": 2,
    "keyword-spacing": 2,
    "block-spacing": 2,
    "brace-style": [2, "1tbs", { "allowSingleLine": true }],
    "space-before-blocks": 2,
    "eqeqeq": 2,
    "key-spacing": 2,
    "arrow-spacing": 2,
    "lines-between-class-members": 2,
    "object-curly-spacing": [2, "always"],
    "object-curly-newline": 2,
    "no-useless-escape": 0,
    "no-multiple-empty-lines": [ 2, { "max": 2, "maxEOF": 0 }],
    "array-bracket-spacing": 2,
    "no-debugger": 0
  }
}
