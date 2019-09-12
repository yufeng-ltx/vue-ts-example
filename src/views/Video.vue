<template>
  <div>
    <Header title="Explore" />
    <div class="content-wrap video-wrap">
    </div>
    <Footer selName="video" />
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

export default class Video extends Vue {

}

</script>

<style lang="scss">
.video-wrap {
}
</style>
