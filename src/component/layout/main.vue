<template>
  <main :class="$style['main']">
    <router-view></router-view>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AppMain extends Vue {}
</script>

<style module lang="stylus">
.main
  padding 30px
  padding-right 0
  overflow hidden
  height 100%
  background #f6f6f6
</style>