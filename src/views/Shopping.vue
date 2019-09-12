<template>
  <div>
    <div class="shopping-wrap"></div>
    <Footer selName="shopping" />
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

export default class Shopping extends Vue {

}

</script>

<style lang="scss">
.shopping-wrap {

}
</style>
