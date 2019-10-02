<template>
  <div class="back-top" @click.prevent="goTop">
    <i class="iconfont icon-arrow-left"></i>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class BackTop extends Vue {
  public goTop() {
    document.body.scrollTop = 0;
  }
}
</script>

<style lang="scss" scoped>
.back-top {
  position: fixed;
  right: 40px;
  bottom: 130px;
  text-align: center;
  background-color: rgba(0, 0, 0, .3);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  color: #fff;
  line-height: 70px;
  cursor: pointer;
  i {
    font-size: 40px;
    &::before {
      transform: rotate(90deg);
      display: block;
    }
  }
}
</style>
