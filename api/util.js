// 错误处理
exports.errResSend = (res, err) => {
  res.end({
    err: 1,
    ET: Math.random()
  });
  err = err || new Error();
  if (err.message) {
    console.error(`error: ${err.message}`);
  }
};

// 成功处理
exports.sucResSend = (res, json) => {
  const data = Object.assign({
    code: 200,
    msg: 'success',
    err: 0,
    ET: Math.random()
  }, json || {});
  res.send(data);
  return data;
};

// url编码
exports.paramStringify = (obj, isEncode = true) => {
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
