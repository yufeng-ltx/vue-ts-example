import axios from 'axios';

const buildEnv = process.env.BUILD_ENV;
let apiRoot = '/';
if (buildEnv === 'SSR') {
  apiRoot = process.env.BUILD_SSR_URL || '/'; // SSR 地址
}

const http = axios.create({
  baseURL: apiRoot + 'API/',
  timeout: 30000
});

export default http;
