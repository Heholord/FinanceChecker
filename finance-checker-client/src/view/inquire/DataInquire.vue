<template>
  <div class="inquirer">
    <!-- TODO  
       custom parsing,
       html and/or json
       options(delete, add, modify, special category) in entity view 
       category view,
       make a finish page (with nice animations)
       jump to finish page when store data and category exits
    -->
    <root-nav/>
    <div class="stepContainer" v-loading="loading">
      <div class="step" v-if="activeStep === 0">
        <el-cascader
          expand-trigger="hover"
          :options="options"
          v-model="selectedBank"
          @change="allowNextStep"
        ></el-cascader>
      </div>
      <div class="step" v-else-if="activeStep === 1">
        <div class="split">
          <file-uploader class="split-elem" fileType="html" :fileSize="20" @onFile="setHTMLFile"/>
          <file-uploader
            class="split-elem"
            fileType="json"
            :fileSize="20"
            text="Drop optional json file here, if you have pre-existing data to merge"
            @onFile="setMergeEntries"
          />
        </div>
      </div>
      <div class="step" v-else-if="activeStep === 2">
        <entry-browser :entries="entries"/>
      </div>
      <div class="step" v-else-if="activeStep === 3">Category</div>
    </div>
    <el-button
      class="stepButton"
      v-show="activeStep > 0"
      icon="el-icon-arrow-left"
      circle
      @click="previousStep"
      ref="next"
    ></el-button>
    <el-button
      class="stepButton"
      icon="el-icon-arrow-right"
      circle
      @click="nextStep"
      ref="next"
      :disabled="disableNextStep"
    ></el-button>
    <el-steps :active="activeStep" align-center>
      <el-step title="Choose a bank" icon="el-icon-tickets"></el-step>
      <el-step title="Upload data" icon="el-icon-upload"></el-step>
      <el-step title="Edit entries" icon="el-icon-edit"></el-step>
      <el-step title="Categorize data" icon="el-icon-menu"></el-step>
    </el-steps>
  </div>
</template>

<script>
import RootNav from "@/components/RootNav";
import FileUploader from "@/components/FileUploader";
import EntryBrowser from "@/components/EntryBrowser";
import { mapGetters } from "vuex";

export default {
  name: "DataInquire",
  components: { RootNav, FileUploader, EntryBrowser },
  data() {
    return {
      activeStep: 0,
      totalSteps: 4,
      disableNextStep: true,
      options: [
        {
          value: "austria",
          label: "Austria",
          children: [
            {
              value: "george",
              label: "George"
            },
            {
              value: "raiffeisen",
              label: "Raiffeisen"
            }
          ]
        }
      ],
      loading: false,
      selectedBank: [],
      categoryData: [],
      content: {},
      mergeEntries: {}
    };
  },
  computed: {
    ...mapGetters({ entries: "data" })
  },
  methods: {
    nextStep() {
      this.disableNextStep = true;
      // merge previous data with new data
      if (this.activeStep === 1) {
        this.loading = true;
        let mergeEntries = this.mergeEntries;
        if (this.$isEmpty(mergeEntries)) {
          mergeEntries = { categories: {}, data: {} };
        }
        let entries = this.$parseHtml(this.content);
        entries = {
          categories: mergeEntries.categories,
          data: { ...entries, ...this.mergeEntries.data }
        };
        this.$store.dispatch("setData", entries).then(() => {
          this.loading = false;
        });
      }
      this.activeStep++;
      if (this.activeStep >= this.totalSteps) {
        this.$router.push("/display");
      }
    },
    previousStep() {
      this.activeStep--;
      this.disableNextStep = false;
    },
    allowNextStep() {
      this.disableNextStep = false;
    },
    setHTMLFile(file) {
      this.disableNextStep = true;
      this.setFile(file, content => {
        this.content = content;
        this.allowNextStep();
      });
    },
    setMergeEntries(file) {
      this.setFile(file, content => {
        this.mergeEntries = JSON.parse(content);
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
  },
  mounted() {
    if (!this.$isEmpty(this.entries)) {
      if (!this.$isEmpty(this.entries.categories)) {
        this.activeStep = this.totalSteps - 1;
      }
    }
  }
};
</script>

<style lang="scss">
div.inquirer {
  display: block;
  .stepButton.el-button {
    margin: 40px 20px;
  }
  .stepContainer {
    justify-content: center;
    align-content: center;
    display: flex;
    min-height: 400px;

    .step {
      margin: auto;
    }
  }
  .split-elem {
    justify-self: center;
    align-self: center;
    margin: auto;
  }
}
</style>
