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
  extends: [
    "eslint:recommended",
    "plugin:vue/recommended"
  ],
  rules: {
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
    "object-curly-spacing": [2, "always", { "objectsInObjects": false }],
    "object-curly-newline": 2,
    "no-useless-escape": 0,
    "no-multiple-empty-lines": [ 2, { "max": 2, "maxEOF": 0 }],
    "array-bracket-spacing": 2,
    "no-debugger": 0
  }
}
