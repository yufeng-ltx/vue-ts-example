<template>
  <div>
    <Header title="Category" />
    <div ref="wrapCont" class="content-wrap music-wrap">
    </div>
    <Footer ref="footer" selName="music" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

@Component({
  components: {
    Header,
    Footer
  }
})
export default class Music extends Vue {
}

</script>

<style lang="scss">
.music-wrap {
}
</style>
