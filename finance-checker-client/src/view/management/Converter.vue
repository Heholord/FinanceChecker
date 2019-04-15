<template>
  <div class="quickupload" v-loading="loading">
    <file-uploader
      class="split-elem"
      fileType="json"
      :fileSize="20"
      text="You can upload your data with the old format"
      @onFile="setOld"
      v-if="$isEmpty(oldData)"
    />
    <div v-if="!$isEmpty(oldData)">
      <file-downloader :filename="'data.json'" :filecontent="newData" :text="'Download your data'"></file-downloader>
    </div>
  </div>
</template>

<script>
import FileUploader from "@/components/FileUploader";
import FileDownloader from "@/components/FileDownloader";
import { getYear, getMonthAsString, download } from "../../plugin/utils";

export default {
  name: "Converter",
  components: { FileUploader, FileDownloader },
  data() {
    return {
      loading: false,
      oldData: {}
    };
  },
  computed: {
    newData() {
      let returnValue = {};

      Object.keys(this.oldData.data).forEach(yearMonth => {
        const year = getYear(yearMonth);
        const month = getMonthAsString(yearMonth);
        if (!returnValue[year]) returnValue[year] = {};
        if (!returnValue[year][month]) returnValue[year][month] = {};

        Object.keys(this.oldData.data[yearMonth]).forEach(day => {
          returnValue[year][month][day] = this.oldData.data[yearMonth][day];
        });
      });
      return download(this.oldData.categories, returnValue);
    }
  },
  methods: {
    setOld(file) {
      this.setFile(file, content => {
        this.oldData = JSON.parse(content);
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
