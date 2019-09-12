const merge = require('webpack-merge');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

process.env.BUILD_ENV = 'SSR';

const webpackCommonConfig = require('./webpack.base');
const { cssLoaders, assetsPath } = require('./utils');

module.exports = merge(webpackCommonConfig, {
  mode: 'production',
  entry: './ssr/entry.js',
  stats: {
    all: false,
    modules: false,
    maxModules: 0,
    errors: true,
    warnings: true,
    moduleTrace: true,
    errorDetails: true
  },
  output: {
    path: path.resolve(__dirname, '../ssr/dist/'),
    filename: assetsPath('js/[name].[contenthash:8].js'),
    chunkFilename: assetsPath('js/[name].[contenthash:8].js'),
    publicPath: '/',
    libraryTarget: 'commonjs2'
  },
  devtool: 'source-map',
  target: 'node',
  externals: nodeExternals({
    whitelist: [/\.css$/]
  }),
  module: {
    rules: cssLoaders({ ssr: true })
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BUILD_ENV': '"SSR"'
    }),
    new ProgressBarPlugin({
      format: '  webpack build [:bar] ' + chalk.green.bold(':percent') + ' :elapseds',
      clear: true,
      summary: false
    }),
    new VueSSRServerPlugin()
  ]
});
