<template>
  <a-modal
    :centered="true"
    :closable="false"
    :mask-closable="false"
    :visible="isShow && visible"
    @cancel="cancel"
    @ok="crop"
    cancel-text="不裁剪，直接上传"
    destroy-on-close
    ok-text="裁剪上传"
    title="裁剪"
    width="auto"
  >
    <div :class="$style['cropper']">
      <vue-cropper
        :auto-crop="true"
        :auto-crop-height="2000"
        :auto-crop-width="2000"
        :canScale="false"
        :center-box="true"
        :fixed="false"
        :full="true"
        :high="false"
        :img="fileData"
        :info-true="true"
        :output-type="outputType"
        ref="cropper"
      ></vue-cropper>
      <!-- auto-crop 超过最大宽高按最大宽高计算 -->
    </div>
  </a-modal>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { VueCropper } from 'vue-cropper';

@Component({
  components: {
    VueCropper,
  },
})
export default class ImageCropper extends Vue {
  @Prop({ type: [String, File], default: '' }) readonly img!: string | File;
  @Prop({ type: Boolean, default: false }) readonly isShow!: boolean;

  visible: boolean = false;
  fileData: string | Blob = '';
  outputType: string = 'jpeg';

  get isImgFile(): boolean {
    return Object.prototype.toString.call(this.img) === '[object File]';
  }

  @Watch('img')
  onImgChange(newVal: string | File) {
    if (typeof newVal === 'string') {
      this.fileData = newVal;
      this.visible = true;
      return;
    }
    if (this.isImgFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fileData = e.target.result;
        this.visible = true;
      };
      reader.readAsDataURL(newVal);
    }
  }

  crop() {
    (this.$refs.cropper as any).getCropBlob((data: Blob) => {
      const img: File = this.img as File;
      const isImgFile: boolean = this.isImgFile;
      const now = new Date();
      const file = new File(
        [data],
        isImgFile ? img.name : `cropped-image.${this.outputType}`,
        {
          lastModified: +now,
        }
      );
      this.$emit('crop', file);
      this.visible = false;
    });
  }

  cancel() {
    this.$emit('crop', false);
    this.visible = false;
  }
}
</script>

<style module lang='stylus'>
.cropper
  width 600px
  height 600px
</style>