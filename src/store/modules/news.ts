import { ActionTree, MutationTree, Module } from 'vuex';
import { AxiosPromise } from 'axios';
import { RootState, QQNewListData, QQNewContentObjData } from '../types';
import * as types from '../mutation-types';
import http from '../../utils/http';

interface State { // 定义接口
  init: boolean
  newList: Array<QQNewListData>
  ids: Array<string>,
  newContent: QQNewContentObjData
}

const state = (): State => ({ // 避免ssr数据公用，state 必须是一个函数
  init: false,
  newList: [],
  ids: [],
  newContent: {}
});

const actions: ActionTree<State, RootState> = {
  fetchNewsList({ commit }, params): AxiosPromise {
    params = params || {};
    return http.get('news/qq/list', { params }).then(res => {
      const data = (res.data || {}).data || {};
      commit(types.SET_NEWS_DATA, data);
      return res;
    });
  },
  fetchNewContent({ commit }, id): AxiosPromise {
    return http.get('news/qq/content', { params: { id } }).then(res => {
      const data = (res.data || {}).data || {};
      commit(types.SET_NEWS_CONTENT, { id, data });
      return res;
    });
  }
};

const mutations: MutationTree<State> = {
  [types.SET_NEWS_DATA](state, data) {
    state.init = true; // 已初始化
    const list: Array<QQNewListData> = data.list || [];
    const ids: Array<string> = data.ids;
    if (ids && ids.length) {
      state.ids = ids; // 重置ids数组
      state.newList = []; // 重置新闻列表
    }
    list.forEach(item => {
      if (item.type === '0' || item.type === '56') { // 只筛选文章和视频
        state.newList.push(item);
      }
      // 剔除已加载的新闻
      const index = state.ids.indexOf(item.id);
      if (index > -1) {
        state.ids.splice(index, 1);
      }
    });
  },
  [types.SET_NEWS_IDS](state) {
    state.ids = state.ids.slice(20); // 设置ids
  },
  [types.SET_NEWS_CONTENT](state, { id, data }) {
    state.newContent = { [id]: data }; // 设置新闻内容
  }
};

const news: Module<State, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations
};

export default news;
