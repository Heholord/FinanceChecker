<template>
  <div id="app">
    <el-tabs class="tabs" type="border-card">
      <el-tab-pane label="Category">
        <Category/>
      </el-tab-pane>
      <el-tab-pane label="History">
        <History/>
      </el-tab-pane>
      <el-tab-pane label="Day of the month stats"></el-tab-pane>
      <el-tab-pane label="Day of the week stats"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Category from "@/view/Category.vue";
import History from "@/view/History.vue";
import palette from "google-palette";

export default {
  name: "app",
  components: {
    History,
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

  .el-aside {
    text-align: left;
    .el-menu .el-menu {
      padding: 0px 10px;
      .el-submenu .el-menu {
        padding-left: 40px;
      }
    }
  }
  .el-main {
    .split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 50px;
      .table {
        margin: 10px;
        margin-left: 50px;
        justify-self: center;
        align-self: start;
      }
      .doughnut {
        justify-self: center;
      }
    }
  }
}
</style>
