<template>
  <a-upload
    :accept="accept"
    :beforeUpload="beforeUpload"
    :customRequest="request"
    :disabled="disabled || loading"
    :showUploadList="false"
    @change="handleChange"
    class="single-file-uploader"
  >
    <div class="single-file-uploader-container">
      <a-icon :type="loading ? 'loading' : fileUrl ? 'reload' : 'plus'" />
    </div>
  </a-upload>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';
import { trim } from '@/util/helper';
const oss = require('bmh/oss');

@Component
export default class SingleFileUpload extends Vue {
  @Prop({ type: String, default: '' }) api!: string;
  @Prop({ type: String, default: 'pic.fuliaoxueyuan.com' }) domain!: string;
  @Prop({ type: String, default: '' }) readonly dir!: string;
  @Prop({ type: String, default: '' }) readonly accept!: string;
  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean;
  @Prop({ type: Function }) readonly beforeUpload!: any;
  @Prop({ type: String, default: '' }) fileUrl!: string;

  loading: boolean = false;

  handleChange(info: any) {
    if (info.file.status === 'uploading') {
      this.loading = true;
      return;
    }
  }

  request(obj: any) {
    const { form_data, request_url } = oss(
      `${this.api}${trim(this.dir, '/')}/`,
      obj.file,
      this.domain
    );
    axios.post(request_url, form_data).then(() => {
      let fileSrc: string = obj.file.src;
      if (/^\/\//.test(fileSrc)) {
        fileSrc = `https:${fileSrc}`;
      }
      this.$emit('update:fileUrl', fileSrc);
      this.loading = false;
    });
  }
}
</script>

<style lang="stylus">
.single-file-uploader
  > .ant-upload
    width 60px
    height 60px
    border 1px solid #E5E5E5
    border-radius 2px
    background-color #fff

  &-container
    width 58px
    height 58px
    flex(center, center)
    color #999
</style>
