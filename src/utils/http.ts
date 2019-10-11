import axios from 'axios';
import { Toast } from 'vant';

const buildEnv = process.env.BUILD_ENV;
let apiRoot = '/';
if (buildEnv === 'SSR') {
  apiRoot = process.env.BUILD_SSR_URL || '/'; // SSR 地址
}

const http = axios.create({
  baseURL: apiRoot + 'API/',
  timeout: 30000
});

// 异常处理
http.interceptors.response.use(res => {
  if (res.data.err !== 0) {
    Toast(res.data.msg || '数据加载失败，请重试');
  }
  return res;
}, err => {
  Toast('服务器请求失败，请重试');
});

export default http;
