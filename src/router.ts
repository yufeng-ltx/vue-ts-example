import Vue from 'vue';
import Router, { RouteConfig, Route } from 'vue-router';

import Index from './views/Index.vue';
import QQNews from './views/News/QQ/index.vue';
import QQNewsContent from './views/News/QQ/content.vue';
import Video from './views/Video.vue';
import Photo from './views/Photo.vue';
import Music from './views/Music.vue';
import Shopping from './views/Shopping.vue';

Vue.use(Router);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: Index,
    children: [
      {
        path: '/',
        name: 'qq-news',
        component: QQNews,
        meta: {
          title: '腾讯新闻'
        }
      },
      {
        path: '/video.html',
        name: 'video',
        component: Video,
        meta: {
          title: '视频合集'
        }
      },
      {
        path: '/music.html',
        name: 'music',
        component: Music,
        meta: {
          title: '热门音乐'
        }
      },
      {
        path: '/photo.html',
        name: 'photo',
        component: Photo,
        meta: {
          title: '热点图片'
        }
      },
      {
        path: '/shopping.html',
        name: 'shopping',
        component: Shopping,
        meta: {
          title: '网购抢先'
        }
      }
    ]
  },
  {
    path: '/news/qq/:id.html',
    name: 'qq-news-content',
    component: QQNewsContent,
    meta: {
      title: '腾讯新闻'
    }
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

export default () => {
  const router = new Router({
    mode: 'history',
    routes,
    scrollBehavior
  });
  // 只有在客户端才运行
  if (process.env.BUILD_ENV !== 'SSR') {
    router.beforeEach((to: Route, from: Route, next: any) => {
      const meta: any = to.meta || {};
      document.title = meta.title || 'vue-ts-example';
      next();
    });
  }

  return router;
};
