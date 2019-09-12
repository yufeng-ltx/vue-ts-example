import Vue from 'vue';
import { Lazyload } from 'vant';

import createApp from './createApp';

import './assets/sass/main.scss';

Vue.config.productionTip = false;

// 图片懒加载
Vue.use(Lazyload, {
  adapter: {
    loaded({ el }: any): void {
      el.removeAttribute('data-src');
    }
  }
});

window.addEventListener('load', () => {
  // 添加service-worker.js
  if (process.env.NODE_ENV === 'production' && navigator.serviceWorker) {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('Service Worker scope: ', registration.scope);
    }).catch(err => {
      console.log(err);
    });
  }
});

// 创建vue实例
const { app, router, store } = createApp();

if (store && window.__INITIAL_STATE__) { // 开启ssr后 载入序列化后的store状态数据
  store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
  app.$mount('#app'); // 挂载app
});
