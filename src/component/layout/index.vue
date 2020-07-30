<template>
  <a-spin :class="$style['spin']" :spinning="loading" v-if="loading"></a-spin>
  <div :class="$style['body']" v-else>
    <AppAside :class="$style['aside']" />
    <AppMain :class="$style['main']" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppAside from '@/component/layout/aside.vue';
import AppMain from '@/component/layout/main.vue';

@Component({
  components: {
    AppAside,
    AppMain,
  },
})
export default class AppLayout extends Vue {
  loading: boolean = false;

  async created() {
    this.loading = true;
    this.loading = false;
  }
}
</script>

<style module lang="stylus">
.spin
  flex(center, center)
  width 100%
  height 100%

.body
  flex()
  height 100%

.aside
  flex-shrink 0

.main
  flex-grow 1
</style>