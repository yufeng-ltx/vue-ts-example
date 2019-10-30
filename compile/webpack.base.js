const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const buildEnv = process.env.BUILD_ENV; // 打包环境

const { assetsPath, cacheInfo } = require('./utils');

module.exports = {
  entry: {
    app: './src/main.ts'
  },
  output: {
    path: path.resolve(__dirname, '../dist/'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.wasm', '.vue', '.json', '.d.ts'], // 自动解析确定的扩展
    alias: {
      '@': path.resolve(__dirname, '../src') // 源码目录
    }
  },
  resolveLoader: {
    modules: [
      'node_modules'
      // path.resolve(__dirname, 'loaders') // 加载loaders
    ]
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(vue|(j|t)sx?)$/,
        exclude: [
          /node_modules/
        ],
        use: [
          {
            loader: 'eslint-loader',
            options: {
              extensions: ['.js', '.jsx', '.vue', '.ts', '.tsx'],
              cache: true,
              emitWarning: true,
              emitError: false,
              formatter: require('eslint-friendly-formatter')
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              ...cacheInfo('vue-loader')
            }
          },
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              },
              ...cacheInfo('vue-loader')
            }
          }
        ]
      },
      {
        test: /\.m?jsx?$/,
        exclude: [
          /node_modules/
        ],
        use: [
          {
            loader: 'cache-loader',
            options: {
              ...cacheInfo('babel-loader')
            }
          },
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              ...cacheInfo('ts-loader')
            }
          },
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: [
                '\\.vue$'
              ],
              getCustomTransformers: () => {
                if (buildEnv !== 'SSR') { // ssr模式不需要引入
                  return {
                    before: [
                      tsImportPluginFactory({ // ts按需加载
                        libraryName: 'vant',
                        libraryDirectory: 'es',
                        style: true
                      })
                    ]
                  };
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2048,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: assetsPath('img/[name].[hash:8].[ext]')
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: assetsPath('img/[name].[hash:8].[ext]')
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: assetsPath('media/[name].[hash:8].[ext]')
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: assetsPath('fonts/[name].[hash:8].[ext]')
                }
              }
            }
          }
        ]
      },
      {
        test: /\.pug$/,
        oneOf: [
          {
            resourceQuery: /vue/,
            use: [
              {
                loader: 'pug-plain-loader'
              }
            ]
          },
          {
            use: [
              {
                loader: 'raw-loader'
              },
              {
                loader: 'pug-plain-loader'
              }
            ]
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CaseSensitivePathsPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      vue: true,
      formatter: 'codeframe',
      logger: (() => {
        const res = console;
        res.info = () => {};
        return res;
      })()
    })
  ]
};
