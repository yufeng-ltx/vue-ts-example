export interface RootState {
  version?: string
}

interface QQNewListData { // qq新闻列表数据结构
  title: string
  id: string
  source: string
  time: number
  img: string
  type: string
}

export interface QQNewContentData { // qq新闻内容详情结构
  title: string
  time: number
  source: string
  html: string
  attr?: {
    [propName: string]: {
      desc?: string
      height?: number
      width?: number
      url?: string
      vid?: string
    }
  }
}

export interface QQNewContentObjData { // 对象 qq新闻内容详情结构
  [id: string]: QQNewContentData
}
