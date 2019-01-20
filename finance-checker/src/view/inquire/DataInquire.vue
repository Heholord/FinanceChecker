<template>
  <div>
    <root-nav/>
    <div class="stepContainer">
      <div class="step" v-if="activeStep === 0">
        <el-cascader
          expand-trigger="hover"
          :options="options"
          v-model="selectedBank"
          @change="allowNextStep"
        ></el-cascader>
      </div>
      <div class="step" v-else-if="activeStep === 1">
        <el-upload
          class="upload-demo"
          drag
          :multiple="false"
          action="https://jsonplaceholder.typicode.com/posts/"
          :file-list="fileList"
          :list-type="'text'"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            Drop html file here or
            <em>click to upload</em>
          </div>
          <div class="el-upload__tip" slot="tip">
            File must have the ending
            <em>.html</em>
          </div>
        </el-upload>
      </div>
      <div class="step" v-else-if="activeStep === 2">Edit</div>
      <div class="step" v-else-if="activeStep === 3">Category</div>
    </div>
    <el-button
      v-show="activeStep > 0"
      icon="el-icon-arrow-left"
      circle
      @click="previousStep"
      ref="next"
    ></el-button>
    <el-button
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
export default {
  name: "DataInquire",
  components: { RootNav },
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
      selectedBank: [],
      categoryData: [],
      entries: []
    };
  },
  methods: {
    nextStep() {
      this.disableNextStep = false;
      this.activeStep++;
      if (this.activeStep >= this.totalSteps) {
        this.$router.push("/display");
      }
    },
    previousStep() {
      switch (this.activeStep) {
        case 1:
        case 2:
          this.entries = []; // caution: break is omitted intentionally
        case 3:
          this.categoryData = [];
          break;
      }
      this.activeStep--;
      this.disableNextStep = false;
    },
    allowNextStep() {
      this.disableNextStep = false;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("Avatar picture must be JPG format!");
      }
      if (!isLt2M) {
        this.$message.error("Avatar picture size can not exceed 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style lang="scss">
.el-button {
  margin: 40px;
}
.stepContainer {
  justify-content: center;
  align-content: center;
  display: flex;
  min-height: 400px;
  .step > * {
    position: relative;
    top: 50%;
  }
}
</style>
