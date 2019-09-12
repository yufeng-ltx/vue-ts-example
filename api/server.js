// 搭设代理服务器
const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const https = require('https');

const apiRoot = '/API/';
const listenPort = 7666;
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// 错误处理
const errHandle = (err, res) => {
  console.error(`error: ${err.message}`);
  res.end({});
};

const paramStringify = (obj, isEncode = true) => {
  let rs = '';
  if (!obj) return rs;
  // 对 key value 编码
  function encodeFn(str) {
    if (isEncode) {
      return String(str)
        .replace(/[^ !'()~\*]/gu, encodeURIComponent)
        .replace(/ /g, '+')
        .replace(/[!'()~\*]/g, ch => '%' + ch.charCodeAt().toString(16).slice(-2).toUpperCase());
    } else {
      return str;
    }
  }
  // 拼接
  Object.keys(obj).forEach(key => {
    let item = '';
    // 支持值为数组
    if (Array.isArray(obj[key])) {
      obj[key].forEach(x => {
        if (x) {
          item = (item && (item + '&')) + encodeFn(key + '[]') + '=' + encodeFn(x);
        }
      });
    } else {
      item = encodeFn(key) + '=' + encodeFn(obj[key]);
    }
    rs = (rs && (rs + '&')) + item;
  });
  return rs;
};

// 获取腾讯新闻
app.use(`${apiRoot}news/list`, (req, res) => {
  let proxyUrl = 'http://openapi.inews.qq.com/getQQNewsIndexAndItems?chlid=news_news_twentyf&refer=mobilewwwqqcom&srcfrom=newsapp&otype=json&ext_action=Fimgurl33,Fimgurl32,Fimgurl30';
  if (req.query.ids) {
    proxyUrl = `http://openapi.inews.qq.com/getQQNewsNormalContent?ids=${req.query.ids}&refer=mobilewwwqqcom&srcfrom=newsapp&otype=json&&extActionParam=Fimgurl33,Fimgurl32,Fimgurl30&extparam=src,desc`;
  }
  const params = paramStringify({ // 连接参数
    key: 'Xw@2017Mmd',
    charset: 'utf-8',
    url: proxyUrl
  });
  const url = 'https://xw.qq.com/service/api/proxy?' + params;
  https.get(url, res1 => {
    let rawData = '';
    res1.setEncoding('utf8');
    res1.on('data', chunk => {
      rawData += chunk;
    });
    res1.on('end', () => {
      const data = {
        code: 200,
        msg: 'success',
        err: 0,
        ET: Math.random(),
        newList: []
      };
      let json = {};
      try {
        json = JSON.parse(rawData);
      } catch (err) {
        errHandle(err, res);
      }
      if (json.idlist) {
        const info = json.idlist[0] || {};
        data.newList = info.newslist || [];
        data.ids = info.ids || [];
      } else {
        data.newList = json.newslist || [];
      }
      res.send(data);
    });
  }).on('error', err => {
    errHandle(err, res);
  });
});

app.listen(listenPort); // 端口监听

console.log();
console.log(chalk.bgBlue.black(' INFO '), `API Listening port ${chalk.cyan(listenPort)}`);
console.log();
