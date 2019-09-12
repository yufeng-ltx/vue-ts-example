import Vue from 'vue';
import {
  Swipe,
  SwipeItem
} from 'vant';
import { sync } from 'vuex-router-sync';

import App from './App.vue';
import createRouter from './router';
import createStore from './store/index';

Vue.use(Swipe).use(SwipeItem);

export default () => {
  const router = createRouter();
  const store = createStore();

  sync(store, router); // 同步路由状态(route state)到 store

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  });
  return { app, router, store };
};
