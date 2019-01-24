<template>
  <el-upload
    class="upload"
    drag
    :multiple="false"
    name="file"
    action
    :accept="fileTypeParsed()"
    :before-upload="setFile"
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">
      Drop {{fileType}} file here or
      <em>click to upload</em>
    </div>
    <div class="el-upload__tip" slot="tip">
      <div v-show="!file">
        File must have the ending
        <em>.{{fileType}}</em>
      </div>
      <div v-show="file">
        <i class="el-icon-success success"></i>
        {{file.name}} ({{fileSizeLabeled}}) uploaded
      </div>
    </div>
  </el-upload>
</template>


<script>
export default {
  components: {},
  name: "FileUploader",
  props: ["fileType", "fileSize"],
  computed: {
    fileSizeLabeled() {
      let fileSize = this.file.size;
      let ending = " bytes";
      if (fileSize > 1024) {
        fileSize = fileSize / 1024;
        ending = " KiB";
      }
      if (fileSize > 1024) {
        fileSize = fileSize / 1024;
        ending = " MiB";
      }
      return Math.round(fileSize * 100) / 100 + ending;
    }
  },
  methods: {
    fileTypeParsed() {
      const fileType = this.fileType;
      if (fileType === "html") return "text/" + fileType;
      else if (fileType === "json") return "application/" + fileType;
      return "";
    },
    setFile(file) {
      const isFileType = file.type === this.fileTypeParsed();
      const isLt20M = file.size / 1024 / 1024 < this.fileSize;

      if (!isFileType) {
        this.$message.error(
          "Uploaded file must be a " + this.fileType + " file!"
        );
      }
      if (!isLt20M) {
        this.$message.error("File can't be bigger than 20MB!");
      }
      this.file = isFileType && isLt20M ? file : false;
      if (this.file) this.$emit("onFile", this.file);
    }
  },
  data() {
    return {
      file: false
    };
  }
};
</script>