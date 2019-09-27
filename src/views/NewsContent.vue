<template>
  <div class="news-content-wrap">
    <div class="header">
      <i class="iconfont icon-arrow-left" @click="$router.go(-1)"></i>
      <span>腾讯新闻</span>
    </div>
    <div class="news-detail">
      <div v-if="!detail" class="qqLoading"></div>
      <div v-else>
        <p class="title">{{ detail.title }}</p>
        <p class="info">{{ detail.source }} <span>{{ dateFormat(detail.time) }}</span></p>
        <div class="cont" v-html="detail.html"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { AxiosPromise } from 'axios';
import { dateFormat } from '../utils/tools';

const newsModule = namespace('news'); // 获取命名空间

@Component
export default class NewsContent extends Vue {
  private detail: any = null;

  private htmlContent: string = '';

  @newsModule.Action
  public fetchNewContent!: (id: any) => AxiosPromise;

  public created(): void {
    //
  }

  public beforeMount(): void {
    this.fetchNewContent(this.$route.params.id).then(res => {
      const data = res.data || {};
      const attr = data.attr || {};
      let html = data.html || '';
      Object.keys(attr).forEach(name => { // html 拼接
        html = html.replace(new RegExp(`<!--${name}-->`), () => {
          const info = attr[name] || {};
          const url = info.url;
          if (url) {
            // const width = (info.width || 0) / 64;
            // const widthStyle = width ? ' style="width: ' + width + 'rem"' : '';
            return `<p class="p-img"${info.vid ? ' data-vid="' + info.vid + '"' : ''}><span class="img"><img src="${url}"></span><span class="desc">${info.desc || ''}</span></div>`;
          } else return '';
        });
      });
      data.html = html;
      this.detail = data;
      document.title = data.title;
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
  .header {
    position: fixed;
    z-index: 10;
    height: 90px;
    width: 100%;
    max-width: $globalMaxHeight; /*no*/
    line-height: 90px;
    padding: 0 20px;
    border-bottom: 1px solid #eee;
    background-color: #537bff;
    color: #fff;
    i {
      float: left;
      font-size: 50px;
      cursor: pointer;
    }
    span {
      padding-left: 20px;
      font-weight: bold;
      font-size: 36px;
    }
  }
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
