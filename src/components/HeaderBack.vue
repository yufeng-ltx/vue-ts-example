<template>
  <div class="header" :style="{ 'background-color': bgColor }">
    <i v-if="showBack" class="iconfont icon-arrow-left" @click="goBack"></i>
    <span>{{ name }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Header extends Vue {
  @Prop({ default: '' }) private name!: string

  @Prop() private bgColor!: string

  @Prop({ default: true }) private showBack!: Boolean

  public goBack() {
    this.$router.go(-1);
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  z-index: 10;
  height: 90px;
  width: 100%;
  top: 0;
  max-width: $globalMaxHeight; /*no*/
  line-height: 90px;
  padding: 0 20px;
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
</style>
