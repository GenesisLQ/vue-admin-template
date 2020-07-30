<template>
  <div :class="$style['multiple-image-uploader']">
    <a-upload
      :accept="accept"
      :beforeUpload="beforeFileUpload"
      :customRequest="request"
      :disabled="disabled || isLoading"
      :fileList="fileList"
      :remove="handleRemove"
      :showUploadList="showUploadList"
      @preview="handlePreview"
      class="multiple-image-uploader"
      listType="picture-card"
      ref="uploader"
    >
      <div v-if="!disabled && (!max || fileList.length < max)">
        <a-icon type="plus" />
      </div>
    </a-upload>
    <image-cropper :img="tempImageFile" :is-show="!!tempImageFile" @crop="crop" v-if="!noCropper"></image-cropper>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { swap } from '@/util/helper';
import { changeLoading } from '@/util/decorators';
import Sortable from 'sortablejs';
import ImageCropper from '@/component/upload-image-cropper.vue';
import oss from 'baimahu/aliyun/oss';
const uuidv4 = require('uuid/v4');
const { VUE_APP_API: API } = process.env;

@Component({
  components: {
    ImageCropper,
  },
})
export default class MultipleImageUpload extends Vue {
  @Prop({ type: String, default: '' }) readonly dir!: string;
  @Prop({ type: String, default: '' }) readonly accept!: string;
  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean;
  @Prop({ type: Function }) readonly beforeUpload!: any;
  @Prop({ type: Array, default: () => [] }) list!: string[];
  @Prop({ type: Number }) max?: number;
  @Prop({
    type: Object,
    default: () => ({ showPreviewIcon: true, showRemoveIcon: true }),
  })
  readonly showUploadList!: any;
  @Prop({ type: Boolean, default: false }) noCropper!: boolean;

  isLoading: boolean = false;
  sortableInstance?: Sortable;
  tempImageFile: File | null = null;
  cropperPromiseResolve: any;

  get fileList() {
    return this.list.map((url: string) => {
      if (typeof url !== 'string') {
        url = 'undefined';
      }
      return { uid: uuidv4(), url, name: url }; // name 属性必填，否则开发环境下会报 warning
    });
  }

  handlePreview(file: any) {
    this.$emit('preview', file.url);
  }

  handleRemove(file: any) {
    const list: string[] = this.list.filter((url: string) => url !== file.url);
    this.$emit('update:list', list);
  }

  beforeFileUpload(file: File, fileList: any[]) {
    if (!this.noCropper) {
      return new Promise(resolve => {
        this.tempImageFile = file;
        this.cropperPromiseResolve = resolve;
      }).then(croppedFile => {
        // croppedFile: file or false, false 直接上传
        if (!(this.beforeUpload && typeof this.beforeUpload === 'function')) {
          return Promise.resolve(croppedFile);
        }
        if (!croppedFile) {
          const beforeUpload = this.beforeUpload(file, fileList);
          return typeof beforeUpload === 'boolean' && !beforeUpload
            ? Promise.reject(null)
            : beforeUpload;
        }
        const beforeUpload = this.beforeUpload(croppedFile, fileList);
        if (beforeUpload === false) {
          return Promise.reject(null);
        }
        if (beforeUpload && typeof beforeUpload.then === 'function') {
          // is beforeUpload a Promise?
          return beforeUpload
            .then(() => Promise.resolve(croppedFile))
            .catch(() => Promise.reject(null));
        }
        return Promise.resolve(croppedFile);
      });
    }

    if (this.beforeUpload && typeof this.beforeUpload === 'function') {
      return this.beforeUpload(file, fileList);
    }
  }

  crop(file: File | boolean) {
    this.cropperPromiseResolve(file);
  }

  @changeLoading(['isLoading'])
  async request(obj: any) {
    const { src } = await oss.upload(
      `https://${API}/boss/aliyun/oss/policy/new`,
      obj.file
    );
    const list: string[] = [...this.list, src];
    this.$emit('update:list', list);
  }

  bindSortable() {
    if (this.sortableInstance) {
      this.sortableInstance.destroy();
    }
    const container: HTMLElement = (this.$refs
      .uploader as any).$el.querySelector('.ant-upload-list');
    this.sortableInstance = Sortable.create(container, {
      onEnd: (e: any) => {
        swap(this.list, e.oldIndex, e.newIndex);
      },
    });
  }

  mounted() {
    this.bindSortable();
  }
}
</script>

<style lang="stylus" module>
.multiple-image-uploader
  overflow hidden
</style>

<style lang="stylus" scoped>
.multiple-image-uploader >>>
  // 2019-05-09 19:41
  // 默认 inline，inline 时 sortablejs 存在 transform: translateZ(0) 无法正常工作
  // sortablejs v1.9.0 ant-design-vue v1.3.8
  // jsfiddle demo 无此问题
  // 原因待查（基本不查了 哪天有空想起来了再查 = =）
  display block

  .ant-upload-select-picture-card, .ant-upload-list-picture-card
    background #fff

  .ant-upload-select-picture-card
    border 1px solid #e5e5e5
    border-radius 2px
    width 60px
    height 60px

    i
      font-size 16px
      color #e5e5e5

  .ant-upload-list-item
    margin 0 16px 16px 0
    border-color transparent
    border-radius 2px
    width 60px
    height 60px
    overflow hidden
    padding 0

    &-info
      > span
        width 100%
        height 100%
</style>
