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
  maxAge: 1000 * 30 // 重要提示：条目在 30 秒后过期。
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

// 替换腾讯图片https
const replaceImgHttps = (src) => {
  if (!src) return src;
  return src.replace('http://inews.gtimg.com/', 'https://inews.gtimg.com/');
};

// 获取腾讯新闻
app.use(`${apiRoot}news/qq/list`, (req, res) => {
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
          time: item.timestamp * 1000,
          img: replaceImgHttps(item.thumbnails && item.thumbnails[0]),
          type: item.articletype
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
app.use(`${apiRoot}news/qq/content`, (req, res) => {
  // 获取缓存数据
  const cache = getCacheFn(req, res);
  if (cache) return true;
  // 抓取信息
  const id = req.query.id;
  if (!id) errResSend(res, new Error('请求出错，没有传入id'));
  https.get(`https://xw.qq.com/cmsid/${id}`, hRes => {
    let rawData = '';
    hRes.setEncoding('utf8');
    hRes.on('data', chunk => {
      rawData += chunk;
    });
    hRes.on('end', () => {
      const regArr = rawData.match(/<script id=\"__NEXT_DATA__\" type=\"application\/json\">(.+?)<\/script>/);
      if (regArr && regArr[1]) {
        try {
          const json = JSON.parse(regArr[1]).props.pageProps.data.data.content;
          let html = json.cnt_html || '';
          const attr = json.cnt_attr || {};
          const attrCopy = {};
          Object.keys(attr).forEach(name => {
            const info = attr[name] || {};
            const img = (info.img || {})['imgurl640'] || {};
            attrCopy[name] = {
              desc: info.desc || '',
              width: img.width || 0,
              height: img.height || 0,
              url: replaceImgHttps(img.imgurl || ''),
              vid: info.vid || ''
            };
          });
          // 设置缓存输出
          setCacheFn(req, res, {
            data: {
              html,
              time: new Date(json.org_time || json.pubtime || '').getTime() || '',
              source: json.chlname || json.src || '',
              title: json.title || '',
              attr: attrCopy
            }
          });
        } catch (err) {
          errResSend(res, new Error('请求出错，解析数据失败'));
        }
      } else {
        errResSend(res, new Error('请求出错，解析数据失败'));
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
