const express = require('express');
const fs = require('fs');
const path = require('path');
const LRU = require('lru-cache');
const { createBundleRenderer } = require('vue-server-renderer');

const { getFlexibleCtx, apiProxy, openGzip } = require('../compile/utils');

const app = express();

// open gzip
openGzip(app);
// api proxy
apiProxy(app);

// Static resource pointing
const staticArr = [
  'static',
  'favicon.ico',
  'manifest.json',
  'robots.txt',
  'service-worker.js'
];
staticArr.forEach(dir => {
  app.use(`/${dir}`, express.static(path.resolve(__dirname, `../dist/${dir}`)));
});

const serverBundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');

const template = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf-8');

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template,
  clientManifest,
  shouldPrefetch: () => false
});

// 设置页面缓存
const microCache = new LRU({
  max: 100,
  maxAge: 1000 * 10 // 重要提示：条目在 10 秒后过期。
});

const isCacheable = (req) => {
  return true;
};

// render page
app.get('*', (req, res) => {
  // 页面缓存
  const cacheable = isCacheable(req);
  if (cacheable) {
    const hit = microCache.get(req.url);
    if (hit) {
      return res.end(hit);
    }
  }
  const context = {
    url: req.url,
    flexibleCtx: getFlexibleCtx(),
    baseURL: '/',
    assetsURL: '/static/'
  };
  renderer.renderToString(context, (err, html) => {
    if (err) {
      if (err.code === 404) {
        res.status(404).end('Page not found');
      } else {
        res.status(500).end(err.stack);
        // res.redirect('/');
        // console.log(err);
      }
    }
    res.status(context.HTTPStatus || 200);
    res.end(html);
    // 设置缓存
    if (cacheable) {
      microCache.set(req.url, html);
    }
  });
});

const port = 7333;
app.listen(port, () => {
  const url = `http://localhost:${port}/`;
  process.env.BUILD_SSR_URL = url; // 定义axios请求地址
  console.log(`\n> server started at ${url} \n`);
});
