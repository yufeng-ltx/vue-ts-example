const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const fse = require('fs-extra');
const webpack = require('webpack');

const webpackConfig = require('./webpack.build');
const { formatStats } = require('./utils');

console.log(chalk.bgBlue.black(' INFO '), 'Starting build file...\n');

const distDirFn = (dir) => {
  return path.resolve(__dirname, `../dist/${dir || ''}`);
};

rm(distDirFn(), err => {
  if (err) throw err;
  fse.copySync(path.resolve(__dirname, '../public/'), distDirFn()); // copy public
  webpack(webpackConfig, (err, stats) => {
    if (err) throw err;
    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1);
    }
    // Print out code details
    formatStats(stats, 'dist');

    // move vue-ssr-client-manifest.json
    const ssrClientName = 'vue-ssr-client-manifest.json';
    const ssrClientDir = distDirFn(ssrClientName);
    if (fse.existsSync(ssrClientDir)) {
      const ssrStaticDir = path.resolve(__dirname, '../ssr/dist/');
      fse.ensureDirSync(ssrStaticDir);
      fse.moveSync(ssrClientDir, path.join(ssrStaticDir, ssrClientName), { overwrite: true });
    }
    // service-worker.js
    const createSW = function() {
      console.log(chalk.bgBlue.black(' INFO '), 'Start create service-worker.js...\n');
      const { injectManifest } = require('workbox-build');
      const UglifyJS = require('uglify-es');
      return new Promise((resolve, reject) => {
        const swName = 'service-worker.js';
        const distDir = `./dist/${swName}`;
        injectManifest({
          swSrc: `./public/${swName}`,
          swDest: distDir,
          globDirectory: './dist/static/',
          globPatterns: ['**\/*.{js,css,jpg,png,jpeg}'],
          modifyUrlPrefix: { '': '/static/' }
        }).then(() => {
          const sw = fse.readFileSync(distDir, 'utf8');
          fse.writeFileSync(distDir, UglifyJS.minify({
            'sw': sw
          }, {}).code, 'utf8');
          resolve();
        }).catch(() => {
          reject();
        });
      });
    };
    createSW().then(() => {
      console.log(chalk.green.bold('\nBuild Complete\n'));
    });
  });
});
