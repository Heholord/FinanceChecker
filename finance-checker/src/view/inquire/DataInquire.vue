<template>
  <div>
    <root-nav/>
    <div class="step">
      <el-cascader expand-trigger="hover" :options="options" v-model="selectedCountry"></el-cascader>
    </div>
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
      disableNextStep: false,
      options: [
        {
          value: "austria",
          label: "Austria",
          children: [
            {
              value: "disciplines",
              label: "Disciplines"
            }
          ]
        }
      ],
      selectedCountry: ""
    };
  },
  methods: {
    nextStep() {
      this.disableNextStep = false;
      this.activeStep++;
      if (this.activeStep >= this.totalSteps) {
        this.$router.push("/display");
      }
    }
  }
};
</script>

<style lang="scss">
.el-button {
  margin: 40px;
}
.step {
  justify-content: center;
  align-content: center;
  display: flex;
  min-height: 400px;
}
</style>
