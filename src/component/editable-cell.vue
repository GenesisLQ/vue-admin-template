<template>
  <div class="editable-cell">
    <div class="editable-cell-input-wrapper" v-if="editable">
      <a-input
        :maxLength="maxLength"
        :value="value"
        @change="handleInputChange"
        @pressEnter="confirm"
        auto-focus
        class="editable-input"
        v-if="!isNumber"
      />
      <a-input-number
        :max="max"
        :min="min"
        :value="value"
        @change="handleNumberChange"
        @pressEnter="confirm"
        auto-focus
        class="editable-input"
        v-else
      />
      <a @click="confirm" href="javascript:;">完成</a>
    </div>
    <div class="editable-cell-text-wrapper" v-else>
      {{ text || '' }}
      <a-icon @click="edit" class="editable-cell-icon" type="form" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class EditableCell extends Vue {
  @Prop() text!: string | number;
  @Prop({ type: Number }) maxLength!: number; // 普通输入框的最大长度
  @Prop({ type: Number }) max!: number; // 数字输入框的最大值
  @Prop({ type: Number }) min!: number; // 数字输入框的最小值
  @Prop({ type: Boolean, default: false }) isNumber!: boolean; // 是否需要显示成数字输入框
  // @Model('change') value!: string | number;
  editable: boolean = false;
  value: string | number = this.text;

  handleInputChange(e: any) {
    this.value = e.target.value;
  }

  handleNumberChange(value: number) {
    this.value = value;
  }

  // 完成
  confirm() {
    this.editable = false;
    if (this.value === this.text) {
      return;
    }
    this.$emit('confirm', this.value);
  }

  edit() {
    this.value = this.text;
    this.editable = true;
  }
}
</script>

<style lang="stylus">
.editable-cell
  flex($v: center, $h: space-between)

  .editable-input
    width 70%
    margin-right 10px

  .editable-cell-text-wrapper
    padding 5px 0 6px
</style>
