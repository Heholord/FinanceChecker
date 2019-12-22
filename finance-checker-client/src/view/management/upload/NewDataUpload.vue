<template>
  <div class="uploader">
    <el-steps direction="vertical" class="step-indicator" :active="activeStep" simple>
      <el-step v-if="activeStep === 0" title="Choose a bank" icon="el-icon-tickets"></el-step>
      <el-step v-else icon="el-icon-tickets"></el-step>
      <el-step v-if="activeStep === 1" title="Upload data" icon="el-icon-upload"></el-step>
      <el-step v-else icon="el-icon-upload"></el-step>
      <el-step v-if="activeStep === 2" title="Categorize data" icon="el-icon-menu"></el-step>
      <el-step v-else icon="el-icon-menu"></el-step>
    </el-steps>

    <div class="stepContainer" v-loading="loading">
      <div class="step" v-if="activeStep === 0">
        <bank-chooser @selected="setBank" />
      </div>
      <div class="step" v-else-if="activeStep === 1">
        <file-uploader
          class="split-elem"
          :fileType="selectedBank[selectedBank.length -1]"
          :fileSize="20"
          @onFile="setContent"
        />
        <!-- TODO Extract into another Component with mergestrategies
           file-uploader
            class="split-elem"
            fileType="json"
            :fileSize="20"
            text="Drop optional json file here, if you have pre-existing data to merge"
            @onFile="setMergeEntries"
        /-->
      </div>
      <div class="step" v-else-if="activeStep === 2">
        <entries-to-category
          :entries="join(entries)"
          :categories="categories"
          @next="allowNextStep"
        />
      </div>
    </div>
    <div class="navigation-control" ref="navctrl">
      <el-button
        class="stepButton left"
        v-show="activeStep > 0"
        type="primary"
        icon="el-icon-arrow-left"
        @click="previousStep"
        ref="next"
      ></el-button>
      <el-button
        class="stepButton right"
        icon="el-icon-arrow-right"
        @click="nextStep"
        type="primary"
        ref="next"
        :disabled="disableNextStep"
      ></el-button>
    </div>
  </div>
</template>

<script>
import FileUploader from "@/components/management/FileUploader";
import EntriesToCategory from "@/components/management/EntriesToCategory";
import BankChooser from "@/components/management/BankChooser";
import { mapGetters } from "vuex";
import { join } from "@/plugin/utils";

export default {
  name: "NewDataUpload",
  components: { FileUploader, EntriesToCategory, BankChooser },
  data() {
    return {
      activeStep: 0,
      totalSteps: 3,
      disableNextStep: true,
      loading: false,
      selectedBank: [],
      categoryData: [],
      content: {},
      mergeEntries: {}
    };
  },
  computed: {
    ...mapGetters({ entries: "data", categories: "categories" })
  },
  methods: {
    nextStep() {
      this.disableNextStep = true;
      // merge previous data with new data
      if (this.activeStep === 1) {
        this.merge();
      }
      this.activeStep++;
      if (this.activeStep >= this.totalSteps) {
        this.$router.push("/visualize");
      }
    },
    setBank(banks) {
      this.selectedBank = banks;
      this.allowNextStep();
    },
    previousStep() {
      this.activeStep--;
      this.disableNextStep = false;
    },
    allowNextStep() {
      this.disableNextStep = false;
    },
    setContent(file) {
      this.setFile(file, content => {
        this.content = content;
        this.allowNextStep();
      });
    },
    setMergeEntries(file) {
      this.setFile(file, content => {
        this.mergeEntries = JSON.parse(content);
        this.allowNextStep();
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
    join(obj) {
      return join(obj);
    },
    merge() {
      let mergeEntries = this.mergeEntries;
      if (this.$isEmpty(mergeEntries)) {
        mergeEntries = { categories: this.categories, data: this.entries };
      }
      let entries = this.$parseHtml(this.content, this.selectedBank.join("."));
      entries = {
        categories: mergeEntries.categories,
        data: { ...entries, ...this.mergeEntries.data }
      };
      this.$store.dispatch("setData", entries);
    }
  },
  mounted() {
    if (!this.$isEmpty(this.entries)) {
      this.activeStep = this.totalSteps - 1;
    }
  }
};
</script>

<style lang="scss">
@import "@/variables.scss";

.uploader {
  box-sizing: border-box;
  width: 100%;

  .navigation-control {
    display: grid;
    grid-template-areas: "left . . right";
    margin: 20px 100px 0px 100px;
    padding: 0;
    justify-content: space-between;

    .stepButton.el-button {
      width: 100px;
      height: 50px;
      &.right {
        grid-area: right;
        margin-left: 0;
      }

      &.left {
        grid-area: left;
      }
    }
    .step-indicator {
      width: 100%;
      margin: auto;
    }
  }

  $step-height: $content-height - 28vh;

  .stepContainer {
    justify-content: center;
    align-content: center;
    display: flex;
    height: $step-height;
    margin: 10px;

    .step {
      margin: auto;
      height: $step-height;
      width: 85%;
      //      overflow-y: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      .split {
        height: 100%;
      }
    }
  }
  .split-elem {
    justify-self: center;
    align-self: center;
    margin: auto;
  }
}
</style>
