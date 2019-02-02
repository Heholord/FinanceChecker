<template>
  <div class="downloader">
    <file-downloader :filename="'data.json'" :filecontent="content" :text="'Download your data'"></file-downloader>
  </div>
</template>

<script>
import FileDownloader from "@/components/FileDownloader";
import { mapGetters } from "vuex";
import { download } from "@/plugin/utils";

export default {
  name: "Upload",
  components: { FileDownloader },
  computed: {
    ...mapGetters({ entries: "data", categories: "categories" }),
    content() {
      return download(this.categories, this.entries);
    }
  },
  methods: {}
};
</script>

<style lang="scss">
.downloader {
  justify-content: center;
  align-content: center;
  display: flex;
  min-height: 300px;
  & > * {
    margin: auto;
  }
}
</style>
