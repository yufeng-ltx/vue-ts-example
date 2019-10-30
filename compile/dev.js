const webpack = require('webpack');
const chalk = require('chalk');
const WebpackDevServer = require('webpack-dev-server');
const portfinder = require('portfinder');

const utils = require('./utils');
const webpackConfig = require('./webpack.server');

const getIPAddress = utils.getIPAddress;

const networkIP = getIPAddress();

console.log(chalk.bgBlue.black(' INFO '), 'Starting development server...\n');
const compiler = webpack(webpackConfig);

portfinder.basePort = 7777;
portfinder.getPortPromise().then(port => {
  let tipsSign = true;
  const url = `http://localhost:${port}/`;
  const server = new WebpackDevServer(compiler, webpackConfig.devServer || {});
  compiler.hooks.done.tap('dev-server', (stats) => {
    if (stats.hasErrors()) {
      return false;
    }
    console.log();
    console.log('  App running at:');
    console.log(`  - Local:   ${chalk.cyan(url)}`);
    if (networkIP) console.log(`  - Network:   ${chalk.cyan(`http://${networkIP}:${port}/`)}`);
    console.log();
    if (tipsSign) {
      require('opn')(url); // open browser
      tipsSign = false;
    }
  });
  server.listen(port);
}).catch(err => {
  console.log();
  console.log(chalk.bgRed.black(' ERROR '), chalk.red('start server with errors.'));
  process.exit(1);
});
