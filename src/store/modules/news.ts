import { ActionTree, MutationTree, Module } from 'vuex';
import { AxiosPromise } from 'axios';
import { RootState } from '../types';
import * as types from '../mutation-types';
import http from '../../utils/http';

interface NewList {
  title: string
  id: string
  source: string
  time: number
  img: string
  type: string
}

interface State { // 定义接口
  init: boolean
  newList: Array<NewList>
  ids: Array<string>
}

const state = (): State => ({ // 避免ssr数据公用，state 必须是一个函数
  init: false,
  newList: [],
  ids: []
});

const actions: ActionTree<State, RootState> = {
  fetchNewsList({ commit }, params): AxiosPromise<State> {
    params = params || {};
    return http.get('news/list', { params }).then(res => {
      const data = (res.data || {}).data;
      commit(types.SET_NEWS_DATA, data);
      return res;
    });
  },
  fetchNewContent({ commit }, id): AxiosPromise {
    return http.get('news/content', { params: { id }}).then(res => {
      const data = res.data || {};
      return data;
    });
  }
};

const mutations: MutationTree<State> = {
  [types.SET_NEWS_DATA](state, data) {
    state.init = true; // 已初始化
    const list: Array<NewList> = data.list || [];
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
  }
};

const news: Module<State, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations
};

export default news;
