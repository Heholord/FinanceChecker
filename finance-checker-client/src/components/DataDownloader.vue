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
@import "@/variables.scss";
.download-container {
  padding: 50px 0px;
  a {
    margin: 0;
    > button {
      background-color: $support-positive4;
      border-color: $support-positive4;
      color: $support-positive1;
      @include make-out-shadow($support-positive3);

      &:hover {
        background-color: $support-positive3;
        border-color: $support-positive3;
        box-shadow: none;
      }
    }
  }
}
</style>
