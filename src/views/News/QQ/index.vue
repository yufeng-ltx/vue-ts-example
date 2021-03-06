<template>
  <div class="news-qq-list">
    <HeaderBack :showBack="false" name="腾讯新闻" />
    <template v-if="homeInit">
      <PullRefresh v-model="refreshLoad" @refresh="onRefresh">
        <List v-model="moreLoad" :finished="finished" :offset="80" @load="onLoadMore">
          <ul v-if="newList.length" class="detail-ul">
            <li v-for="item in newList" :key="item.id">
              <div>
                <a href="javascript:;" @click="$router.push(`/news/qq/${item.id}.html`)">
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
import HeaderBack from '@/components/HeaderBack.vue';
import { transformDate } from '@/utils/tools';
import * as types from '@/store/mutation-types';
import { QQNewListData } from '@/store/types';
import { SSRAsyncData } from '@/types/types';

const newsModule = namespace('news'); // 获取命名空间

@Component({
  components: {
    HeaderBack,
    List,
    PullRefresh
  }
})
export default class QQNews extends Vue {
  private refreshLoad: boolean = false; // 上拉加载标识

  private moreLoad: boolean = false; // 下滑滚动加载标识

  @newsModule.State private newList!: Array<QQNewListData>;

  @newsModule.State private ids!: Array<string>;

  @newsModule.State('init') private homeInit!: boolean;

  @newsModule.Action
  public fetchNewsList!: (params?: { ids?: string, _t?: number }) => AxiosPromise;

  @newsModule.Mutation(types.SET_NEWS_IDS)
  public setNewsIds!: () => void;

  private get finished(): boolean { // 新闻列表全部加载标识
    return !this.ids.length;
  }

  // 挂载之前操作
  public beforeMount() {
    if (!this.homeInit) { // 已初始化不再执行
      this.fetchNewsList(); // 加载腾讯新闻
    }
  }

  public asyncData({ store }: SSRAsyncData): AxiosPromise { // ssr初始化加载，数据预取
    return store.dispatch('news/fetchNewsList');
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
}
</script>

<style lang="scss">
.news-qq-list {
  padding-top: 100px;
  .detail-ul {
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
          background: #f8f8f8 url('~@/assets/images/qq-logo.svg') no-repeat center center;
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
