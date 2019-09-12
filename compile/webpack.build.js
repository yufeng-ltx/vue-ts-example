const merge = require('webpack-merge');
const chalk = require('chalk');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

const { assetsPath, cssLoaders, getFlexibleCtx } = require('./utils');
const webpackCommonConfig = require('./webpack.base');

const webpackConfig = merge(webpackCommonConfig, {
  mode: 'production',
  output: {
    filename: assetsPath('js/[name].[contenthash:8].js'),
    chunkFilename: assetsPath('js/[name].[contenthash:8].js'),
    publicPath: '/'
  },
  devtool: false,
  performance: {
    hints: false // 关闭打包体积检测提示
  },
  module: {
    rules: cssLoaders({ extract: true })
  },
  plugins: [
    new ProgressBarPlugin({
      format: '  webpack build [:bar] ' + chalk.green.bold(':percent') + ' :elapseds',
      clear: true,
      summary: false
    }),
    new MiniCssExtractPlugin({
      filename: assetsPath('css/[name].[contenthash:8].css'),
      chunkFilename: assetsPath('css/[name].[contenthash:8].css')
    }),
    new webpack.HashedModuleIdsPlugin({
      hashDigest: 'hex'
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      templateParameters: { // 模板变量定义
        BASE_URL: '/',
        ASSETS_URL: '/static/',
        flexibleJS: getFlexibleCtx()
      },
      minify: { // 开启压缩
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeScriptTypeAttributes: true
      }
    }),
    new VueSSRClientPlugin() // ssr vue-ssr-client-manifest.json
  ],
  optimization: {
    namedModules: true,
    namedChunks: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: 4,
        sourceMap: false,
        uglifyOptions: {
          output: {
            comments: false
          },
          compress: {
            drop_debugger: true
          }
        }
      }),
      new OptimizeCssAssetsPlugin()
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/].*?\.(js|jsx|ts|tsx)$/,
          priority: 10,
          chunks: 'initial'
        }
      }
    }
  }
});

if (process.env.npm_config_report) { // npm run build --report 打包分析
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
