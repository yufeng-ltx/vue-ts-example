<template>
  <div>
    <Header />
    <router-view class="content-wrap" />
    <Footer />
    <BackTop />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import BackTop from '../components/BackTop.vue';

@Component({
  components: { // 依赖组件
    Header,
    Footer,
    BackTop
  }
})
export default class Index extends Vue {

}
</script>

<style lang="scss">
.content-wrap {
  padding: 100px 0;
  position: relative;
  height: 100%;
  background-color: #fff;
  @include clearfix;
}
</style>
