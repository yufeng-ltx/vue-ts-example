import { ActionTree, MutationTree, Module } from 'vuex';
import { AxiosPromise } from 'axios';
import { RootState } from '../types';
import * as types from '../mutation-types';
import http from '../../utils/http';

interface Ids {
  [index: number]: {
    id?: string
    exist?: number
    comments?: number
  }
}

interface NewList {
  [index: number]: {
    title?: string
    url?: string
    id?: string
    source?: string
    timestamp?: number
    thumbnails?: Array<string>
  }
}

interface State { // 定义接口
  init?: boolean,
  newList?: NewList,
  ids?: Ids
}

const state = (): State => ({ // 避免ssr数据公用，state 必须是一个函数
  init: false,
  newList: [],
  ids: []
});

const actions: ActionTree<State, RootState> = {
  fetchNewsList({ commit }, params): AxiosPromise<State> {
    return http.get('news/list', params).then(res => {
      const data = res.data || {};
      commit(types.SET_NEWS_DATA, data);
      return res;
    });
  }
};

const mutations: MutationTree<State> = {
  [types.SET_NEWS_DATA](state, data) {
    state.init = true; // 已初始化
    state.newList = data.newList || [];
    if (data.ids && data.ids.length) {
      state.ids = data.ids;
    }
  }
};

const news: Module<State, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations
};

export default news;
