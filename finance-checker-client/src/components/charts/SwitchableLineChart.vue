<template>
  <div>
    <el-switch
      v-model="isStacked"
      @change="$emit('stacked', isStacked)"
      active-text="cumulative"
      inactive-text="usual"
    ></el-switch>
    <line-chart :chartData="chartData" :stacked="isStacked"></line-chart>
  </div>
</template>


<script>
import LineChart from "./LineChart.vue";

export default {
  components: {
    LineChart
  },
  props: {
    chartData: Object,
    stacked: {
      optional: true,
      default: true
    }
  },
  data() {
    return {
      isStacked: this.stacked
    };
  }
};
</script>