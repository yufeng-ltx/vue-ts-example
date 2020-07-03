<template>
  <div class="footer">
    <ul class="nav-ul">
      <li v-for="item in navList" :key="item.name" :class="{ active: item.name === $route.name }">
        <a @click.prevent="linkJump(item.link)">
          <i :class="['iconfont', 'icon-' + item.icon]"></i>
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Footer extends Vue {
  // 导航列表
  private navList: { name: string, icon: string, link: string }[] = [
    { name: 'qq-news', icon: 'xinwen', link: '' },
    { name: 'video', icon: 'shipin1', link: 'video.html' },
    { name: 'music', icon: 'yinle', link: 'music.html' },
    { name: 'photo', icon: 'image', link: 'photo.html' },
    { name: 'shopping', icon: 'gouwu', link: 'shopping.html' }
  ];

  public created(): void {
    // console.log('组件创建');
  }

  // 点击跳转路径
  public linkJump(link: string): void {
    this.$router.push(`/${link}`, () => {});
  }
}
</script>

<style lang="scss" scoped>

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 92px;
  max-width: $globalMaxHeight; /*no*/
  background-color: #fff;
  z-index: 10;
  box-shadow: 0 0 4px 1px #eee;
  .nav-ul {
    display: flex;
    height: 100%;
    line-height: 92px;
    li {
      flex: 1;
      text-align: center;
      &.active i {
        color: #5daf90;
      }
    }
    i {
      font-size: 50px;
      color: #666;
      display: block;
      height: 100%;
    }
  }
}
</style>
