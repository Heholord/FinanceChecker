<template>
  <div class="quickupload" v-loading="loading">
    <div v-if="!$store.getters.hasData">
      <file-uploader
        class="split-elem"
        fileType="json"
        :fileSize="20"
        text="You can quickdrop an existing data file here if you have one"
        @onFile="setMergeEntries"
      />
    </div>
    <div v-else>
      <choices :choices="choices" @select="execute" title="Didn't you give me some data already?"></choices>
    </div>
  </div>
</template>

<script>
import FileUploader from "@/components/FileUploader";
import Choices from "@/components/Choices";
import { mapGetters } from "vuex";

export default {
  name: "QuickUpload",
  components: { FileUploader, Choices },
  data() {
    return {
      loading: false,
      choices: [
        {
          text: "I want to upload some other data",
          subtext: "and my old data can be deleted",
          image: "delete.svg",
          delete: true
        },
        {
          text: "I got lost",
          subtext: "Can you bring me to the page with the charts and stuff",
          image: "data.svg",
          route: "/visualize"
        },
        {
          text: "Yeah, you'r right",
          subtext: "I just wanted to make sure I did",
          info: true
        }
      ]
    };
  },
  computed: {
    ...mapGetters({ entries: "data", categories: "categories" })
  },
  methods: {
    setMergeEntries(file) {
      this.setFile(file, content => {
        let mergeEntries = JSON.parse(content);
        this.updateStore(mergeEntries, () => {
          this.$router.push("/visualize");
        });
      });
    },
    updateStore(data, doneAction) {
      this.$store.dispatch("setData", data).then(() => {
        if (doneAction) doneAction();
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
    },
    execute(choice) {
      if (choice.delete) this.updateStore({ data: {}, categories: {} });
      if (choice.route) this.$routeTo(choice.route);
    }
  }
};
</script>

<style lang="scss" scoped>
.quickupload {
  justify-content: center;
  align-content: center;
  display: flex;
  a {
    margin: 10px;
    cursor: pointer;
    display: block;
    color: #409eff;
    font-style: normal;
  }
}
</style>
