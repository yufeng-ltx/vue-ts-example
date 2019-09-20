<template>
  <div class="news-wrap">
    <ul v-if="newList.length" class="news-list-ul">
      <li v-for="item in newList" :key="item.id">
        <div>
          <a href="javascript:;" @click="$router.push(`/news/content/${item.id}.html`)">
            <span class="tit">{{ item.title }}</span>
            <span v-if="item.thumbnails && item.thumbnails.length" class="img">
              <img v-lazy="item.thumbnails[0]">
            </span>
          </a>
        </div>
        <p>{{ item.source }} &nbsp; <span>{{ transDate(item.timestamp) }}</span></p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const newsModule = namespace('news'); // 获取命名空间

@Component({
  components: { // 依赖组件
    //
  }
})
export default class News extends Vue {
  @newsModule.State private newList!: {}[];

  @newsModule.State private ids!: {}[];

  @newsModule.State('init')
  private homeInit!: boolean;

  @newsModule.Action
  public fetchNewsList!: () => void;

  public created(): void {
    if (!this.homeInit) { // 已初始化不再执行
      this.fetchNewsList(); // 加载腾讯新闻
    }
  }

  public transDate(time: number): string {
    let res = '';
    let t = (new Date().getTime() - Number(time) * 1000) / 1000;
    t = parseInt(t.toString(), 10);
    const day = Math.floor(t / (60 * 60 * 24));
    const hour = Math.floor(t / (60 * 60));
    const minute = Math.floor(t / 60);
    if (day > 0) return day + '天前';
    if (hour > 0) return hour + '小时前';
    if (minute > 0) return minute + '分钟前';
    return '刚刚';
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
