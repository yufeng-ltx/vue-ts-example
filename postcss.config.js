const postcssPresetEnv = require('postcss-preset-env');
const postcssAdaptive = require('postcss-adaptive');

module.exports = {
  plugins: [
    postcssPresetEnv({
      stage: 3,
      features: {
        'nesting-rules': true
      },
      autoprefixer: true, // 自动加prefixer
      preserve: false
    }),
    postcssAdaptive({
      autoRem: true // 开启px转换
    })
  ]
};
