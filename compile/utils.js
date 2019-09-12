
const os = require('os');
const path = require('path');
const fs = require('fs');
const hash = require('hash-sum');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let cacheConfig = null;

const setCacheConfig = () => {
  cacheConfig = {
    BUILD_ENV: process.env.BUILD_ENV,
    NODE_ENV: process.env.NODE_ENV // env
  };

  const cacheConfigFiles = [ // watch file change
    './utils.js',
    './webpack.common.conf.js',
    '../babel.config.js',
    '../tsconfig.json'
  ];

  cacheConfigFiles.forEach(name => {
    const dir = path.resolve(__dirname, name);
    if (!fs.existsSync(dir)) return false;
    name = name.replace(/.*\/([^\.]*).*/, '$1');
    cacheConfig[name] = fs.readFileSync(dir, 'utf-8');
  });
};

exports.getIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (let devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length;i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return false;
};

exports.assetsPath = (_path) => {
  const assetsSubDirectory = 'static';
  return path.posix.join(assetsSubDirectory, _path);
};

exports.cacheInfo = (name) => {
  if (!name) return {};
  if (!cacheConfig) setCacheConfig(); // set cacheConfig
  const cacheDirectory = path.resolve(__dirname, `../node_modules/.cache/${name}`);
  const cacheIdentifier = hash({
    name,
    cacheConfig
  });
  return { cacheDirectory, cacheIdentifier };
};

exports.cssLoaders = (options) => {
  options = options || {};
  // load base
  options.sass = {
    data: '@import "~@/assets/sass/libs/base.scss";'
  };

  const sourceMap = !!options.sourceMap;
  const cssLoader = {
    loader: 'css-loader',
    options: {
      importLoaders: 2,
      sourceMap
    }
  };
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap
    }
  };
  const generateLoaders = (loader, loaderOptions) => {
    const loaders = [cssLoader, postcssLoader];
    if (loader) {
      const opt = options[loader] || {};
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap
        }, opt)
      });
    }
    if (options.ssr) return loaders; // ssr，No output style
    if (options.extract) {
      return [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: process.env.NODE_ENV === 'development'
          // publicPath: '../../' // use relative path
        }
      }].concat(loaders);
    } else {
      return [{
        loader: 'vue-style-loader',
        options: {
          sourceMap,
          shadowMode: false
        }
      }].concat(loaders);
    }
  };
  const loadersObj = {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  };
  const output = [];
  for (const extension in loadersObj) {
    const loader = loadersObj[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    });
  }
  return output;
};

// show info
exports.formatStats = (stats, dir) => {
  const path = require('path');
  const zlib = require('zlib');
  const chalk = require('chalk');
  const ui = require('cliui')({ width: 80 });
  const url = require('url');

  const json = stats.toJson({
    hash: false,
    modules: false,
    chunks: false
  });

  let assets = json.assets
    ? json.assets
    : json.children.reduce((acc, child) => acc.concat(child.assets), []);

  const seenNames = new Map();
  const isJS = val => /\.js$/.test(val);
  const isCSS = val => /\.css$/.test(val);
  const isMinJS = val => /\.min\.js$/.test(val);
  assets = assets
    .map(a => {
      a.name = url.parse(a.name).pathname;
      return a;
    })
    .filter(a => {
      if (seenNames.has(a.name)) {
        return false;
      }
      seenNames.set(a.name, true);
      return isJS(a.name) || isCSS(a.name);
    })
    .sort((a, b) => {
      if (isJS(a.name) && isCSS(b.name)) return -1;
      if (isCSS(a.name) && isJS(b.name)) return 1;
      if (isMinJS(a.name) && !isMinJS(b.name)) return -1;
      if (!isMinJS(a.name) && isMinJS(b.name)) return 1;
      return b.size - a.size;
    });

  function formatSize (size) {
    return (size / 1024).toFixed(2) + ' KiB';
  }

  function getGzippedSize (asset) {
    const filepath = path.resolve(__dirname, path.join('../', dir, asset.name));
    const buffer = fs.readFileSync(filepath);
    return formatSize(zlib.gzipSync(buffer).length);
  }

  function makeRow (a, b, c) {
    return `  ${a}\t    ${b}\t ${c}`;
  }

  ui.div(
    makeRow(
      chalk.cyan.bold('File'),
      chalk.cyan.bold('Size'),
      chalk.cyan.bold('Gzipped')
    ) + '\n\n' +
    assets.map(asset => makeRow(
      /js$/.test(asset.name)
        ? chalk.green(path.join(dir, asset.name))
        : chalk.blue(path.join(dir, asset.name)),
      formatSize(asset.size),
      getGzippedSize(asset)
    )).join('\n')
  );

  console.log(`${ui.toString()}\n\n  ${chalk.gray('Images and other types of assets omitted.')}\n`);
};

// flexible
exports.getFlexibleCtx = () => {
  const UglifyJS = require('uglify-es');
  let flexibleJS = '';
  const flexibleDir = path.resolve(__dirname, '../public/static/libs/flexible.js');
  if (fs.existsSync(flexibleDir)) {
    flexibleJS = fs.readFileSync(flexibleDir, 'utf8');
    flexibleJS = UglifyJS.minify({ js: flexibleJS }, {}).code;
  }
  return flexibleJS;
};

// api proxy
exports.apiProxy = (app) => {
  const proxyTab = {
    '/API/': {
      target: 'http://localhost:7666/', // proxy address
      changeOrigin: true,
      cookieDomainRewrite: { '*': '' }
    }
  };
  if (!app) return proxyTab;
  else {
    Object.keys(proxyTab).forEach((context) => {
      let options = proxyTab[context];
      if (typeof options === 'string') {
        options = { target: options };
      }
      app.use(require('http-proxy-middleware')(context, options));
    });
  }
};

// open gzip
exports.openGzip = (app) => {
  const compression = require('compression');
  app.use(compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    }
  }));
};
