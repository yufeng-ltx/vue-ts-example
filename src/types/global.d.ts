declare global {
  interface Window { // 拓展Window对象，支持写入全局变量
    // [PropName: string]: any
    __INITIAL_STATE__?: any // ssr vuex state数据源
  }
}

export {};
