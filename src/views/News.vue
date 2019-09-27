<template>
  <div class="news-wrap">
    <template v-if="homeInit">
      <PullRefresh v-model="refreshLoad" @refresh="onRefresh">
        <List v-model="moreLoad" :finished="finished" :offset="80" @load="onLoadMore">
          <ul v-if="newList.length" class="news-list-ul">
            <li v-for="item in newList" :key="item.id">
              <div>
                <a href="javascript:;" @click="$router.push(`/news/content/${item.id}.html`)">
                  <span class="tit">{{ item.title }}</span>
                  <span v-if="item.img" class="img">
                    <img v-lazy="item.img">
                  </span>
                </a>
              </div>
              <p>{{ item.source }} &nbsp; <span>{{ transDate(item.time) }}</span></p>
            </li>
          </ul>
        </List>
      </PullRefresh>
    </template>
    <div v-else class="qqLoading"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { List, PullRefresh } from 'vant';
import { AxiosPromise } from 'axios';
import { transformDate } from '../utils/tools';
import * as types from '../store/mutation-types';

const newsModule = namespace('news'); // 获取命名空间

@Component({
  components: {
    List,
    PullRefresh
  }
})
export default class News extends Vue {
  private refreshLoad: boolean = false; // 上拉加载标识

  private moreLoad: boolean = false; // 下滑滚动加载标识

  @newsModule.State private newList!: Array<any>;

  @newsModule.State private ids!: Array<string>;

  @newsModule.State('init')
  private homeInit!: boolean;

  @newsModule.Action
  public fetchNewsList!: (params?: any) => AxiosPromise;

  @newsModule.Mutation(types.SET_NEWS_IDS)
  public setNewsIds!: () => void;

  private get finished(): boolean { // 新闻列表全部加载标识
    return !this.ids.length;
  }

  public created(): void {
    //
  }

  public beforeMount(): void {
    if (!this.homeInit) { // 已初始化不再执行
      this.fetchNewsList(); // 加载腾讯新闻
    }
  }

  public transDate = transformDate;

  public onRefresh(): void { // 刷新新闻列表
    this.fetchNewsList({ _t: new Date().getTime() }).then(() => { // 加时间戳，防治接口缓存
      this.refreshLoad = false;
    });
  }

  public onLoadMore(): void { // 加载更多
    const ids = this.ids.slice(0, 20); // 获取前面20条id
    if (!ids || !ids.length) return;
    this.setNewsIds(); // 删掉前面20条数据
    this.fetchNewsList({ ids: ids.join(',') }).then(() => {
      this.moreLoad = false;
    });
  }

  public asyncData({ store }: any): void { // ssr初始化加载，数据预取
    return store.dispatch('news/fetchNewsList');
  }
}
</script>

<style lang="scss">
.news-wrap {
  .news-list-ul {
    overflow: hidden;
    clear: both;
    margin: 0 32px;
    li {
      clear: both;
      overflow: hidden;
      border-bottom: 1px solid #eee;
      padding: 20px 0;
      &:last-child {
        border-bottom: none;
      }
      >div {
        @include clearfix;
      }
      a {
        @include clearfix;
      }
      .tit {
        font-size: 34px;
        line-height: 1.4;
        float: left;
        width: 67%;
        margin-right: 3%;
      }
      .img {
        float: right;
        width: 30%;
      }
      img {
        display: block;
        width: 100%;
        height: 125px;
        border-radius: 8px;
        &[lazy="loading"],
        &[lazy="error"] {
          background: #f8f8f8 url('../assets/images/qq-logo.svg') no-repeat center center;
          background-size: 60px auto;
        }
      }
      p {
        margin-top: 25px;
        overflow: hidden;
        clear: both;
        color: #999;
        span {
          color: #ccc;
        }
      }
    }
  }
}
</style>
