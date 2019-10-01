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
import FileUploader from "@/components/management/FileUploader";
import FileDownloader from "@/components/management/FileDownloader";
import {
  download,
  forEachElem,
  clone,
  flatten,
  prepareDataOnDate
} from "../../plugin/utils";

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
      let conversion = [4, 3, 1, 6, 5, 2, 9, 0, 7, 8];
      let flatInCategories = flatten(this.oldData.categories.in);
      let flatOutCategories = flatten(this.oldData.categories.out);

      forEachElem(this.oldData.data, (year, month, day, elem) => {
        if (isInCat(elem, flatInCategories, flatOutCategories)) {
          let newElem = clone(elem);
          let newAmount = "";
          for (let i = 0; i < elem.amount.length; i++) {
            if (!isNaN(+elem.amount[i])) {
              newAmount += conversion[+elem.amount[i]];
            } else {
              newAmount += elem.amount[i];
            }
          }
          newElem.amount = newAmount;
          prepareDataOnDate(year, month, day, returnValue);
          returnValue[year][month][day].push(newElem);
        }
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

function isInCat(elem, flatInCategories, flatOutCategories) {
  if (+elem.amount > 0 && flatInCategories.indexOf(elem.info) < 0) return false;
  if (+elem.amount < 0 && flatOutCategories.indexOf(elem.info) < 0)
    return false;
  return true;
}
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
