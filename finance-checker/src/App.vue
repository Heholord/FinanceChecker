<template>
  <div id="app">
    <el-tabs class="tabs" type="border-card">
      <el-tab-pane label="Big">
        <div class="text"></div>
        <doughnut class="doughnut" v-if="loaded" :chartData="chartData" :options="chartOptions"></doughnut>
      </el-tab-pane>
      <el-tab-pane label="Small">
        <doughnut
          class="doughnut small"
          v-if="loaded"
          :chartData="chartData"
          :options="chartOptions"
        ></doughnut>
      </el-tab-pane>
      <el-tab-pane label="Category">
        <Category/>
      </el-tab-pane>
      <el-tab-pane label="Year"></el-tab-pane>
      <el-tab-pane label="Month"></el-tab-pane>
      <el-tab-pane label="Day of the month stats"></el-tab-pane>
      <el-tab-pane label="Day of the week stats"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Doughnut from "./components/Doughnut.vue";
import Category from "@/view/Category.vue";
import palette from "google-palette";

export default {
  name: "app",
  components: {
    Doughnut,
    Category
  },
  data() {
    return {
      loaded: false,
      chartData: { datasets: [], labels: [] },
      chartOptions: { cutoutPercentage: 60 }
    };
  },
  mounted: function() {
    this.loaded = false;
    let filteredData = this.$filterByCategory(this.categories.out.food);
    this.chartData.datasets.push({
      data: filteredData.map(el => {
        return Math.abs(el.value);
      }),
      backgroundColor: palette("tol", filteredData.length).map(hex => {
        return "#" + hex;
      })
    });
    this.chartData.labels.push(
      ...filteredData.map(el => {
        return el.category;
      })
    );
    this.loaded = true;
  },
  methods: {}
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 20px;

  .doughnut {
    width: 800px;
    height: 800px;
    &.small {
      width: 400px;
      height: 400px;
    }
  }

  .tabs {
    height: 100%;
  }
}
</style>
