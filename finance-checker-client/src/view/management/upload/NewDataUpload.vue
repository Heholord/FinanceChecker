<template>
  <div class="uploader">
    <el-steps
      direction="vertical"
      class="step-indicator"
      :active="activeStep"
      simple
    >
      <el-step
        v-for="step in steps"
        :key="step.name"
        :title="stepTitle(step)"
        :icon="step.icon"
      ></el-step>
    </el-steps>

    <div class="stepContainer" v-loading="loading">
      <div class="step visual-content">
        <bank-chooser @selected="setBank" v-if="isStep('selectBank')" />
        <file-uploader
          v-else-if="isStep('upload')"
          :fileType="selectedBank[selectedBank.length - 1]"
          :fileSize="20"
          @onFile="setContent"
        />
        <entry-browser v-else-if="isStep('edit')" :entries="newEntries" edit />
        <entry-browser v-else-if="isStep('merge')" />
        <entries-to-category
          v-else-if="isStep('categorize')"
          :entries="join(entries)"
          :categories="categories"
          @next="allowNextStep"
        />
      </div>
    </div>
    <div class="navigation-control" ref="navctrl">
      <el-button
        class="stepButton left"
        v-show="activeStep > findStepIndex('selectBank')"
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
import FileUploader from "@/components/management/FileUploader"
import EntryBrowser from "@/components/management/EntryBrowser"
import EntriesToCategory from "@/components/management/EntriesToCategory"
import BankChooser from "@/components/management/BankChooser"
import { mapGetters } from "vuex"
import { join } from "@/plugin/utils"

export default {
  name: "NewDataUpload",
  components: { FileUploader, EntriesToCategory, BankChooser, EntryBrowser },
  data() {
    return {
      steps: [
        { name: "selectBank", title: "Choose a bank", icon: "el-icon-tickets" },
        { name: "upload", title: "Upload data", icon: "el-icon-upload" },
        { name: "edit", title: "Edit data", icon: "el-icon-edit" },
        { name: "merge", title: "Merge data", icon: "el-icon-connection" },
        { name: "categorize", title: "Categorize data", icon: "el-icon-menu" },
      ],
      findStepIndex: (elemName) => {
        return this.steps.findIndex((elem) => elem.name == elemName)
      },
      activeStep: 0,
      disableNextStep: true,
      loading: false,
      selectedBank: [],
      newEntries: {},
    }
  },
  mounted() {
    if (!this.hasData) {
      this.steps.splice(this.findStepIndex("merge"), 1)
    }
  },
  computed: {
    ...mapGetters({
      entries: "data",
      categories: "categories",
      hasData: "hasData",
    }),
  },
  methods: {
    nextStep() {
      this.activeStep++

      if (this.activeStep === this.steps.merge && !this.hasData) {
        // export to data merger
        this.merge()
        this.nextStep()
      }
      if (this.activeStep >= this.steps.length) {
        this.$router.push("/visualize")
      }

      if (
        this.activeStep in
        [this.steps.selectBank, this.steps.upload, this.steps.merge]
      ) {
        //this.disableNextStep = true;
      }
    },
    isStep(stepTitle) {
      return this.activeStep === this.findStepIndex(stepTitle)
    },
    stepTitle(step) {
      return this.activeStep == this.findStepIndex(step.name) ? step.title : ""
    },
    setBank(banks) {
      this.selectedBank = banks
      this.allowNextStep()
    },
    previousStep() {
      this.activeStep--
      this.disableNextStep = false
    },
    allowNextStep() {
      this.disableNextStep = false
    },
    setContent(file) {
      this.setFile(file, (content) => {
        this.newEntries = this.$parseContent(
          content,
          this.selectedBank.join("."),
        )
        this.allowNextStep()
      })
    },
    setFile(file, contentCall) {
      this.loading = true
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target.result
        contentCall(content)
        this.loading = false
      }
      reader.readAsText(file)
    },
    join(obj) {
      return join(obj)
    },
    merge() {
      let entries = {
        categories: this.categories,
        data: { ...this.newEntries, ...this.entries },
      }
      this.$store.dispatch("setData", entries)
    },
  },
}
</script>

<style lang="scss">
@import "@/variables.scss";

.uploader {
  box-sizing: border-box;
  width: 100%;

  .visual-content {
    max-width: $size11;
  }

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
