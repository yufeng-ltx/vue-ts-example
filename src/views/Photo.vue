<template>
  <div>
    <div class="photo-wrap"></div>
    <Footer selName="photo" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Footer from '../components/Footer.vue';

@Component({
  components: {
    Footer
  }
})

export default class Photo extends Vue {

}

</script>

<style lang="scss">
.photo-wrap {

}
</style>
