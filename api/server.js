// 搭设代理服务器
const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const https = require('https');
const LRU = require('lru-cache');

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

// 设置接口缓存
const microCache = new LRU({
  max: 100,
  maxAge: 1000 * 60 // 重要提示：条目在 60 秒后过期。
});

// 获取缓存
const getCacheFn = (req, res) => {
  const hit = microCache.get(req.originalUrl);
  if (hit) return res.send(hit);
};
// 设置缓存
const setCacheFn = (req, res, data) => {
  microCache.set(req.originalUrl, sucResSend(res, data));
};

// 获取腾讯新闻
app.use(`${apiRoot}news/list`, (req, res) => {
  // 获取缓存数据
  const cache = getCacheFn(req, res);
  if (cache) return true;
  // 抓取qq新闻列表
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
        json = json.idlist[0] || {};
        data.ids = (json.ids || []).map(item => item.id);
      }
      data.list = (json.newslist || []).map(item => {
        return {
          title: item.title,
          id: item.id,
          source: item.source,
          time: item.timestamp,
          img: item.thumbnails && item.thumbnails[0]
        };
      });
      // 设置缓存输出
      setCacheFn(req, res, { data });
    });
  }).on('error', err => {
    errResSend(res, err);
  });
});

// 腾讯新闻详情
app.use(`${apiRoot}news/content`, (req, res) => {
  // 获取缓存数据
  const cache = getCacheFn(req, res);
  if (cache) return true;
  // 抓取信息
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
            let html = json.cnt_html || '';
            const attr = json.cnt_attr || {};
            Object.keys(attr).forEach(name => {
              html = html.replace(new RegExp(`<!--${name}-->`), () => {
                const info = attr[name] || {};
                const url = ((info.img || {})['imgurl640'] || {}).imgurl;
                if (url) {
                  return `<p class="p-img"${info.vid && ' data-vid="' + info.vid + '"'}><span class="img"><img src="${url}"></span><span class="desc">${info.desc || ''}</span></div>`;
                } else return '';
              });
            });
            // 设置缓存输出
            setCacheFn(req, res, {
              data: {
                html,
                time: json.org_time || json.pubtime || '',
                source: json.chlname || json.src || '',
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
