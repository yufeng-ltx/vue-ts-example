declare global {
  interface Window { // 拓展Window对象，支持写入全局变量
    [PropName: string]: any
  }
}

export {};
