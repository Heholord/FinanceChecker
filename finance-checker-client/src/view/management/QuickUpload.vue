<template>
  <div class="uploader" v-loading="loading">
    <div v-if="$isEmpty(mergeEntries)">
      <file-uploader
        class="split-elem"
        fileType="json"
        :fileSize="20"
        text="Drop optional json file here, if you have pre-existing data to merge"
        @onFile="setMergeEntries"
      />
    </div>
    <div v-else>
      Data has been uploaded. Do you want to
      upload different data?
      <a
        @click="mergeEntries={}"
      >Click here</a>
    </div>
  </div>
</template>

<script>
import FileUploader from "@/components/FileUploader";
import { mapGetters } from "vuex";

export default {
  name: "QuickUpload",
  components: { FileUploader },
  data() {
    return {
      loading: false,
      mergeEntries: {}
    };
  },
  computed: {
    ...mapGetters({ entries: "data", categories: "categories" })
  },
  methods: {
    setMergeEntries(file) {
      this.setFile(file, content => {
        this.mergeEntries = JSON.parse(content);
        this.$store.dispatch("setData", this.mergeEntries).then(() => {
          this.$router.push("/visualize");
        });
      });
    },
    setFile(file, contentCall) {
      this.loading = true;
      const reader = new FileReader();
      reader.onload = event => {
        const content = event.target.result;
        contentCall(content);
        this.loading = false;
      };
      reader.readAsText(file);
    }
  }
};
</script>

<style lang="scss">
.uploader {
  display: block;
  a {
    margin: 10px;
    cursor: pointer;
    display: block;
    color: #409eff;
    font-style: normal;
  }
}
</style>
