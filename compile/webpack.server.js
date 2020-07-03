const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackCommonConfig = require('./webpack.base');
const { cssLoaders, apiProxy } = require('./utils');

module.exports = merge(webpackCommonConfig, {
  mode: 'development',
  entry: {
    app: ['./src/main.ts']
  },
  output: {
    filename: '[name].js'
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    historyApiFallback: { // 兼容vue-router history模式
      disableDotRule: true
    },
    contentBase: path.resolve(__dirname, '../public'),
    hot: true,
    quiet: true,
    clientLogLevel: 'none',
    proxy: apiProxy()
  },
  module: {
    rules: cssLoaders()
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new webpack.HotModuleReplacementPlugin(), // 热更新
    new webpack.ProgressPlugin() // 显示进度状态
  ]
});
