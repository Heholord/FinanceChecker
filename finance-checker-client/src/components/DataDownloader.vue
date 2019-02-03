<template>
  <div class="download-container">
    <file-downloader :filename="'data.json'" :filecontent="content" :text="'Download your data'"></file-downloader>
  </div>
</template>


<script>
import FileDownloader from "@/components/FileDownloader";
import { mapGetters } from "vuex";
import { download } from "@/plugin/utils";

export default {
  name: "DataDownloader",
  components: { FileDownloader },
  computed: {
    ...mapGetters(["data", "categories"]),
    content() {
      return download(this.categories, this.data);
    }
  }
};
</script>


<style lang="scss">
.download-container {
  padding: 50px 0px;
}
</style>
