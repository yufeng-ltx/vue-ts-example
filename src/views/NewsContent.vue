<template>
  <div v-html="htmlContent"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { AxiosPromise } from 'axios';

const newsModule = namespace('news'); // 获取命名空间

@Component
export default class NewsContent extends Vue {
  private htmlContent: string = '';

  @newsModule.Action
  public fetchNewContent!: (id: any) => AxiosPromise;

  public created(): void {
    this.fetchNewContent(this.$route.params.id).then(res => {
      // if (data.)
      const data = res.data || {};
      this.htmlContent = data.html || '';
    });
  }
}
</script>

<style lang="scss">

</style>
