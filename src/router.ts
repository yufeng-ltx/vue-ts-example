import Vue from 'vue';
import Router, { RouteConfig, Route } from 'vue-router';

import News from './views/News.vue';
import Photo from './views/Photo.vue';
import Music from './views/Music.vue';
import Shopping from './views/Shopping.vue';

Vue.use(Router);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'news',
    component: News
  },
  {
    path: '/video',
    name: 'video',
    component: () => import(/* webpackChunkName: "Video" */ './views/Video.vue')
  },
  {
    path: '/music',
    name: 'music',
    component: Music
  },
  {
    path: '/photo',
    name: 'photo',
    component: Photo
  },
  {
    path: '/shopping',
    name: 'shopping',
    component: Shopping
  }
];

// 路由切换的滚动行为
const scrollBehavior = (to: Route, from: Route, savedPosition: any) => {
  // 后退/前进时的位置
  if (savedPosition) {
    return savedPosition;
  } else {
    const position: any = {};
    // 需要滚动到顶部的单独配置
    let isToTop = to.matched.some((m: any) => m.meta.scrollToTop || m.meta.scrollToTop === undefined);
    if (isToTop) {
      position.x = 0;
      position.y = 0;
    }
    return position;
  }
};

export default () => new Router({
  mode: 'history',
  routes,
  scrollBehavior
});
