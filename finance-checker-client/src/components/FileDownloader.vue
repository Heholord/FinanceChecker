<template>
  <a class="file-download" :href="filecontent" :download="filename">
    <el-button icon="el-icon-download">{{text}}</el-button>
  </a>
</template>


<script>
export default {
  components: {},
  name: "FileDownloader",
  props: ["filename", "filecontent", "text"]
};
</script>


<style lang="scss">
.file-download {
  margin: 20px;
}
</style>
