<template>
  <a-modal
    :footer="null"
    :visible="visible"
    :width="width"
    @cancel="handleCancel"
    centered
    wrapClassName="custom-modal"
  >
    <h2>{{ title }}</h2>
    <slot name="content"></slot>
    <div class="footer">
      <a-button
        @click="handleCancel"
        class="cancel-btn"
        type="default"
        v-if="isShowCancel"
      >{{ cancelText }}</a-button>
      <a-button @click="handleOk" type="primary">{{ okText }}</a-button>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class CustomModal extends Vue {
  @Prop({ type: String, default: '' }) title!: string;
  @Prop({ type: Boolean, default: false }) visible!: boolean;
  @Prop({ type: String, default: '取消' }) cancelText!: string;
  @Prop({ type: String, default: '确定' }) okText!: string;
  @Prop({ type: Number, default: 520 }) width!: number;
  @Prop({ type: Boolean, default: true }) isShowCancel!: boolean; // 是否显示取消按钮

  handleCancel() {
    this.$emit('cancel');
  }

  handleOk() {
    this.$emit('ok');
  }
}
</script>

<style lang="stylus">
.custom-modal
  font-family 'PingFangSC-Regular', Helvetica, Arial, sans-serif

  h2
    margin-bottom 20px

  .footer
    flex($v: center, $h: center)
    margin-top 30px

    .cancel-btn
      margin-right 20px

  .ant-form-item-label
    overflow visible
    text-align left
</style>