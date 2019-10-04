<template>
  <div v-show="backtop" class="back-top" @click.prevent="goTop">
    <i class="iconfont icon-arrow-left"></i>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import anime from 'animejs';

@Component
export default class BackTop extends Vue {
  private backtop: boolean = false

  public mounted() {
    this.$nextTick(() => {
      document.addEventListener('scroll', this.onScrollHandler);
    });
  }

  public destroyed() {
    document.removeEventListener('scroll', this.onScrollHandler);
  }

  public onScrollHandler() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    this.backtop = scrollTop >= 400;
  }

  public goTop() {
    anime({
      targets: [document.body, document.documentElement],
      scrollTop: 0,
      easing: 'easeOutQuad',
      duration: 400
    });
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
