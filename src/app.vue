<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <component :is="layout" v-if="is_login"></component>
      <Login v-else />
    </div>
  </a-config-provider>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppLayout from '@/component/layout/index.vue';
// import Login from '@/view/passport/login.vue';
import { State } from 'vuex-class';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

@Component({
  components: {
    AppLayout,
  },
})
export default class App extends Vue {
  @State('is_login') is_login!: boolean;
  locale: any = zhCN;

  get layout() {
    const { meta } = this.$route;
    const { layout } = meta;
    return layout || 'AppLayout';
  }
}
</script>

<style lang="stylus">
@import './style/app'

#app
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #444
  height 100%
</style>
