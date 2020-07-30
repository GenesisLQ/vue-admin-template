<template>
  <div class="single-image-upload-wrapper">
    <a-upload
      :accept="accept"
      :beforeUpload="beforeFileUpload"
      :class="shape === 'circular' ? 'circular-image' : ''"
      :customRequest="request"
      :disabled="disabled || loading"
      :showUploadList="false"
      @change="handleChange"
      class="single-image-uploader"
      listType="picture-card"
      ref="upload"
    >
      <div class="thumbnail" v-if="imageUrl">
        <img :src="imageUrl" />
        <div class="icon-list">
          <a-icon @click.stop="handlePreview" type="eye" />
          <a-icon @click.stop="handleRemove" class="delete" type="delete" v-if="!disabled" />
        </div>
      </div>
      <div v-else-if="!disabled">
        <a-icon :type="loading ? 'loading' : 'plus'" />
      </div>
    </a-upload>
    <image-cropper :img="tempImageFile" :is-show="!!tempImageFile" @crop="crop" v-if="!noCropper"></image-cropper>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { changeLoading } from '@/util/decorators';
import oss from 'baimahu/aliyun/oss';
import ImageCropper from '@/component/upload-image-cropper.vue';
const { VUE_APP_API: API } = process.env;

@Component({
  components: {
    ImageCropper,
  },
})
export default class SingleImageUpload extends Vue {
  @Prop({ type: String, default: 'default' }) readonly dir!: string;
  @Prop({ type: String, default: '' }) readonly accept!: string;
  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean;
  @Prop({ type: Function }) readonly beforeUpload!: any;
  @Prop({ type: String, default: '' }) imageUrl!: string;
  @Prop({ type: String, default: '' }) shape!: string; // 需求上有要求圆形的样式，此参数用来判断用圆形还是矩形
  @Prop({ type: Boolean, default: false }) noCropper!: boolean;
  @Prop({ type: String, default: '' }) operate!: string; // 判断是否启用某些功能

  loading: boolean = false;
  tempImageFile: File | null = null;
  cropperPromiseResolve: any;

  handleChange(info: any) {
    if (info.file.status === 'uploading') {
      this.loading = true;
      return;
    }
  }

  handlePreview() {
    this.$emit('preview', this.imageUrl);
  }

  handleRemove() {
    this.$emit('update:imageUrl', '');
  }

  beforeFileUpload(file: File) {
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
          const beforeUpload = this.beforeUpload(file);
          return typeof beforeUpload === 'boolean' && !beforeUpload
            ? Promise.reject(null)
            : beforeUpload;
        }
        const beforeUpload = this.beforeUpload(croppedFile);
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
      return this.beforeUpload(file);
    }
  }

  crop(file: File | boolean) {
    this.cropperPromiseResolve(file);
  }

  @changeLoading(['loading'])
  async request(obj: any) {
    const { src } = await oss.upload(
      `https://${API}/boss/aliyun/oss/policy/new`,
      obj.file
    );
    this.$emit('update:imageUrl', src);
  }
}
</script>

<style lang="stylus">
.single-image-uploader
  > .ant-upload
    width 60px
    height 60px
    border 1px solid #E5E5E5
    background-color #fff

  .ant-upload-select-picture-card
    i
      color #e5e5e5
      font-size 16px

  .ant-upload-select-picture-card
    .ant-upload-text
      margin-top 8px
      color #666

    .ant-upload
      padding 2px

  .thumbnail
    position relative
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center

    &:hover .icon-list
      display block

    img
      max-width 100%
      max-height 100%

    .icon-list
      width 100%
      height 100%
      position absolute
      top 0
      background rgba(0, 0, 0, 0.3)
      padding-top 16px
      display none

    .delete
      margin-left 5px

    i
      color #fff

.circular-image
  > .ant-upload
    width 40px
    height 40px
    border-radius 50%

  .ant-upload-select-picture-card
    .ant-upload
      padding 0

  .thumbnail
    border-radius 50%

    img, .icon-list
      border-radius 50%

    .icon-list
      padding 0

      i
        position absolute
        top 50%
        left 50%
        transform translate(-50%, -50%)
</style>