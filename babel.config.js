module.exports = {
  presets: [
    ['@babel/preset-env', {
      'modules': false
    }],
    '@vue/babel-preset-jsx' // jsx转换
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-decorators', { legacy: true }], // 转换修饰器
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-transform-runtime'] // 可设置转换级别
  ]
};
