const express = require('express');
const portfinder = require('portfinder');
const opn = require('opn');
const path = require('path');
const bodyParser = require('body-parser');
const connectHistory = require('connect-history-api-fallback');

const { apiProxy, openGzip } = require('./utils');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// handle fallback for HTML5 history API
app.use(connectHistory({
  htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
  disableDotRule: true
}));

// open gzip
openGzip(app);
// api proxy
apiProxy(app);
app.use(express.static(path.resolve(__dirname, '../dist/')));

// new promise
new Promise((resolve, reject) => {
  // default port
  portfinder.basePort = 7373;
  // check port
  portfinder.getPort((err, port) => {
    if (err) reject(err);
    const url = 'http://localhost:' + port;
    console.log('open at ' + url + '\n');
    app.listen(port);
    opn(url);
    resolve({ url, port });
  });
});
