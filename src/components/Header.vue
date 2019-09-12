<template>
  <div class="header">
    <!-- <h1 v-if="title" class="tit">{{ title }}</h1> -->
    <div class="search">
      <i class="iconfont icon-search"></i>
      <input type="text" placeholder="百度搜索" />
      <a href="javascript:;">
        <i class="iconfont icon-paizhao"></i>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Header extends Vue {
  @Prop() private title!: string
}
</script>

<style lang="scss" scoped>
.header {
  padding: 10px 32px;
  position: fixed;
  width: 100%;
  max-width: $globalMaxHeight; /*no*/
  top: 0;
  z-index: 10;
  background-color: #fff;
  .tit {
    font-size: 42px;
    line-height: 70px;
  }
  .search {
    margin-top: 10px;
    background-color: #f4f6fb;
    border-radius: 12px;
    height: 70px;
    position: relative;
    font-size: 28px;/*px*/
    color: #c4c4c4;
    i {
      font-size: 38px;
      color: #c4c4c4;
    }
    input {
      background-color: transparent;
      padding: 0 70px;
      width: 100%;
      display: block;
      height: 100%;
      position: relative;
    }
    >i, >a {
      position: absolute;
      top: 0;
      z-index: 1;
      height: 100%;
      top: 16px;
    }
    >i {
      left: 16px;
    }
    >a {
      right: 16px;
    }
  }
}
</style>
