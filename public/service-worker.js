/* eslint-disable */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js')

workbox.setConfig({
  debug: false
});

workbox.core.skipWaiting(); // 直接跳过waiting状态
workbox.core.clientsClaim(); // 立即接管客户端
workbox.precaching.precacheAndRoute([]);
