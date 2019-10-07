<template>
  <div class="news-content-wrap">
    <HeaderBack name="腾讯新闻" />
    <div class="news-detail">
      <div v-if="!detail" class="qqLoading"></div>
      <div v-else>
        <p class="title">{{ detail.title }}</p>
        <p class="info">{{ detail.source }} <span>{{ dateFormat(detail.time) }}</span></p>
        <div class="cont" v-html="detail.html"></div>
      </div>
    </div>
    <BackTop />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { AxiosPromise } from 'axios';
import BackTop from '../components/BackTop.vue';
import HeaderBack from '../components/HeaderBack.vue';
import { dateFormat, base64Trans } from '../utils/tools';

const newsModule = namespace('news'); // 获取命名空间

@Component({
  components: {
    HeaderBack,
    BackTop
  }
})
export default class NewsContent extends Vue {
  private detail: any = null;

  private htmlContent: string = '';

  private newId: string = '';

  private lazyObj: any = null;

  @newsModule.State
  private newContent!: any;

  @newsModule.Action
  public fetchNewContent!: (id: any) => AxiosPromise;

  private get currentContent(): any {
    this.newId = this.$route.params.id;
    return this.newContent[this.newId] || null;
  }

  // public cre

  public beforeMount(): void {
    console.log(this.currentContent);
    // if
    // this.fetchNewContent(this.$route.params.id).then(res => {
    //   const data = res.data || {};
    //   const attr = data.attr || {};
    //   let html = data.html || '';
    //   Object.keys(attr).forEach(name => { // html 拼接
    //     html = html.replace(new RegExp(`<!--${name}-->`), () => {
    //       const info = attr[name] || {};
    //       let url = info.url;
    //       if (url) {
    //         const height = (info.height || 0) / 64;
    //         const heightStyle = height ? ' style="height: ' + height + 'rem"' : '';
    //         return `<p class="p-img"${info.vid ? ' data-vid="' + info.vid + '"' : ''}><span class="img"><img${heightStyle} data-src="${url}"></span><span class="desc">${info.desc || ''}</span></div>`;
    //       } else return '';
    //     });
    //   });
    //   data.html = html;
    //   this.detail = data;
    //   document.title = data.title;
    //   // 图片懒加载
    //   this.$nextTick(() => {
    //     const attr = 'data-src';
    //     const $img: Array<Element> = Array.prototype.slice.call(document.body.querySelectorAll(`img[${attr}]`));
    //     if (!$img.length) return;
    //     // 图片在可视区域，执行
    //     const complete = (target: Element) => {
    //       let src = target.getAttribute(attr);
    //       if (!src) return;
    //       target.setAttribute('src', src);
    //       target.removeAttribute(attr);
    //       target.removeAttribute('style');
    //     };
    //     this.lazyObj = new IntersectionObserver((entries, observer) => {
    //       entries.forEach((entry) => {
    //         if (entry.intersectionRatio > 0) {
    //           const target = entry.target;
    //           observer.unobserve(target);
    //           complete(target);
    //         }
    //       });
    //     });
    //     $img.forEach((e) => {
    //       if (!e.getAttribute('src')) { // 设置透明背景
    //         e.setAttribute('src', base64Trans);
    //       }
    //       this.lazyObj.observe(e);
    //     });
    //   });
    // });
  }

  public destroyed() {
    if (this.lazyObj && this.lazyObj.disconnect) {
      this.lazyObj.disconnect(); // 清除监听lazyImg
    }
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
