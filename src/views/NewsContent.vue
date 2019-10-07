<template>
  <div class="news-content-wrap">
    <HeaderBack name="腾讯新闻" />
    <div class="news-detail">
      <div v-if="!currentContent" class="qqLoading"></div>
      <div v-else>
        <p class="title">{{ currentContent.title }}</p>
        <p class="info">{{ currentContent.source }} <span>{{ dateFormat(currentContent.time) }}</span></p>
        <div class="cont" v-html="htmlContent"></div>
      </div>
    </div>
    <BackTop />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { AxiosPromise } from 'axios';
import BackTop from '../components/BackTop.vue';
import HeaderBack from '../components/HeaderBack.vue';
import { dateFormat, lazyImg } from '../utils/tools';

const newsModule = namespace('news'); // 获取命名空间

@Component({
  components: {
    HeaderBack,
    BackTop
  }
})
export default class NewsContent extends Vue {
  private htmlContent: string = '';

  private newId: string = '';

  private lazyObj: any = null;

  @newsModule.State
  private newContent!: any;

  @newsModule.Action
  public fetchNewContent!: (id: string) => AxiosPromise;

  private get currentContent(): any {
    this.newId = this.$route.params.id;
    return this.newContent[this.newId] || null;
  }

  @Watch('currentContent')
  public newsChange() { // 监听变化
    this.setNewsDetail();
    this.renderOther();
  }

  public created() {
    this.setNewsDetail(); // 初始化
  }

  public beforeMount() {
    if (this.currentContent) {
      this.renderOther();
    } else {
      this.fetchNewContent(this.newId); // 请求接口
    }
  }

  public destroyed() {
    if (this.lazyObj && this.lazyObj.disconnect) {
      this.lazyObj.disconnect(); // 清除监听lazyImg
    }
  }

  public asyncData({ store, route }: any): void { // ssr初始化加载，数据预取
    return store.dispatch('news/fetchNewContent', route.params.id);
  }

  public setNewsDetail() {
    const data = this.currentContent;
    if (!data) return false;
    const attr = data.attr || {};
    let html = data.html || '';
    Object.keys(attr).forEach(name => { // html 拼接
      html = html.replace(new RegExp(`<!--${name}-->`), () => {
        const info = attr[name] || {};
        let url = info.url;
        if (url) {
          const height = (info.height || 0) / 64;
          const heightStyle = height ? ' style="height: ' + height + 'rem"' : '';
          return `<p class="p-img"${info.vid ? ' data-vid="' + info.vid + '"' : ''}><span class="img"><img${heightStyle} data-src="${url}"></span><span class="desc">${info.desc || ''}</span></p>`;
        } else return '';
      });
    });
    this.htmlContent = html;
  }

  public renderOther() {
    if (!this.currentContent) return;
    document.title = this.currentContent.title;
    this.$nextTick(() => {
      this.lazyObj = lazyImg();
    });
  }

  public dateFormat(time: string): string {
    const date = new Date(time);
    return dateFormat(date, 'MM-dd hh:mm');
  }
}
</script>

<style lang="scss">
.news-content-wrap {
  .news-detail {
    padding: 100px 30px 20px 30px;
    line-height: 1.5;
    .title {
      font-size: 40px;
      font-weight: bold;
    }
    .info {
      padding: 10px 0;
      font-size: 28px;
      span {
        color: #bbb;
        padding-left: 20px;
      }
    }
    .cont {
      font-size: 34px;
      padding-top: 20px;
      p {
        padding-bottom: 20px;
        &.p-img {
          span {
            display: block;
            overflow: hidden;
            clear: both;
            position: relative;
          }
          img {
            max-width: 100%;
            display: block;
            margin: 0 auto;
          }
          .desc {
            font-size: 28px;
            color: #666;
            padding: 10px 0;
          }
          &[data-vid] {
            .img {
              background-color: #000;
              &::after {
                content: '';
                display: block;
                background: url('../assets/images/play-circle.svg') no-repeat;
                position: absolute;
                cursor: pointer;
                width: 120px;
                height: 120px;
                background-size: 120px auto;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
              }
            }
            img {
              width: 80%!important;
            }
          }
        }
      }
    }
  }
}
</style>
