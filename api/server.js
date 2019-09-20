// 搭设代理服务器
const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const https = require('https');

const apiRoot = '/API/';
const listenPort = 7666;
const app = express();

const { sucResSend, errResSend, openGzip, paramStringify } = require('./util');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// open gzip
openGzip(app);

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
      const data = {};
      let json = {};
      try {
        json = JSON.parse(rawData);
      } catch (err) {
        errResSend(res, err);
      }
      if (json.idlist) {
        const info = json.idlist[0] || {};
        data.newList = info.newslist || [];
        data.ids = info.ids || [];
      } else {
        data.newList = json.newslist || [];
      }
      sucResSend(res, data);
    });
  }).on('error', err => {
    errResSend(res, err);
  });
});

// 腾讯新闻详情
app.use(`${apiRoot}news/content`, (req, res) => {
  const id = req.query.id;
  if (!id) errResSend(res, new Error('没有传入id'));
  https.get(`https://xw.qq.com/cmsid/${id}`, hRes => {
    let rawData = '';
    hRes.setEncoding('utf8');
    hRes.on('data', chunk => {
      rawData += chunk;
    });
    hRes.on('end', () => {
      const regArr = rawData.match(/var\s+globalConfig\s+=\s+(\{[^]*\};)[\n\s]+<\/script>/);
      if (regArr && regArr[1]) {
        try {
          eval(`global.globalConfig = ${regArr[1]}`);
          if (global.globalConfig) {
            const json = global.globalConfig.content || {};
            sucResSend(res, {
              data: {
                html: json.cnt_html || '',
                attr: json.cnt_attr || {},
                time: json.alt_time || '',
                author: json.chlname || '',
                title: json.title || ''
              }
            });
          } else throw new Error('解析出错');
        } catch (err) {
          errResSend(res, err);
        }
      } else {
        errResSend(res, new Error('内容抓取失败'));
      }
    });
  }).on('error', err => {
    errResSend(res, err);
  });
});

app.listen(listenPort); // 端口监听

console.log();
console.log(chalk.bgBlue.black(' INFO '), `API Listening port ${chalk.cyan(listenPort)}`);
console.log();
