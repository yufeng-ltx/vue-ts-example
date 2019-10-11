import { Store } from 'vuex';
import { Route } from 'vue-router';

export interface SSRAsyncData { // ssr 预加载函数参数接口
  store: Store<any>
  route: Route
}
