<template>
  <div class="uploader">
    <el-steps direction="vertical" class="step-indicator" :active="activeStep" simple>
      <el-step v-if="activeStep === steps.selectBank" title="Choose a bank" icon="el-icon-tickets"></el-step>
      <el-step v-else icon="el-icon-tickets"></el-step>
      <el-step v-if="activeStep === steps.upload" title="Upload data" icon="el-icon-upload"></el-step>
      <el-step v-else icon="el-icon-upload"></el-step>
      <el-step v-if="activeStep === steps.edit" title="Edit data" icon="el-icon-edit"></el-step>
      <el-step v-else icon="el-icon-edit"></el-step>
      <el-step
        v-if="activeStep === steps.merge && hasData"
        title="Merge data"
        icon="el-icon-connection"
      ></el-step>
      <el-step v-else-if="hasData" icon="el-icon-connection"></el-step>
      <el-step v-if="activeStep === steps.categorize" title="Categorize data" icon="el-icon-menu"></el-step>
      <el-step v-else icon="el-icon-menu"></el-step>
    </el-steps>

    <div class="stepContainer" v-loading="loading">
      <div class="step" v-if="activeStep === steps.selectBank">
        <bank-chooser @selected="setBank" />
      </div>
      <div class="step center" v-else-if="activeStep === steps.upload">
        <file-uploader
          :fileType="selectedBank[selectedBank.length -1]"
          :fileSize="20"
          @onFile="setContent"
        />
      </div>
      <div class="step" v-else-if="activeStep === steps.edit">
        <entry-browser :entries="newEntries" />
      </div>
      <div class="step" v-else-if="activeStep === steps.merge">
        <entry-browser />
      </div>
      <div class="step" v-else-if="activeStep === steps.categorize">
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
        v-show="activeStep > steps.selectBank"
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
import EntryBrowser from "@/components/management/EntryBrowser";
import EntriesToCategory from "@/components/management/EntriesToCategory";
import BankChooser from "@/components/management/BankChooser";
import { mapGetters } from "vuex";
import { join } from "@/plugin/utils";

export default {
  name: "NewDataUpload",
  components: { FileUploader, EntriesToCategory, BankChooser, EntryBrowser },
  data() {
    return {
      steps: {
        selectBank: 0,
        upload: 1,
        edit: 2,
        merge: 3,
        categorize: 4
      },
      activeStep: 0,
      disableNextStep: true,
      loading: false,
      selectedBank: [],
      newEntries: {}
    };
  },
  computed: {
    ...mapGetters({
      entries: "data",
      categories: "categories",
      hasData: "hasData"
    })
  },
  methods: {
    nextStep() {
      this.activeStep++;

      if (this.activeStep === this.steps.merge && !this.hasData) {
        // export to data merger
        this.merge();
        this.nextStep();
      }
      if (this.activeStep >= this.steps.length) {
        this.$router.push("/visualize");
      }

      if (
        this.activeStep in
        [this.steps.selectBank, this.steps.upload, this.steps.merge]
      ) {
        //this.disableNextStep = true;
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
        this.newEntries = this.$parseContent(
          content,
          this.selectedBank.join(".")
        );
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
      let entries = {
        categories: this.categories,
        data: { ...this.newEntries, ...this.entries }
      };
      this.$store.dispatch("setData", entries);
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
      overflow-y: auto;
      &.center {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
