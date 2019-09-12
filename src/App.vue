<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      name: 'app'
    };
  },
  created() {
    //
  }
});
</script>

<style lang="scss">
#app {
  background-color: #fff;
  position: relative;
}
</style>
