<template>
  <div id="app">
    <el-tabs class="tabs" type="border-card">
      <el-tab-pane label="Overview">
        <Overview/>
      </el-tab-pane>
      <el-tab-pane label="Category Browser">
        <Category/>
      </el-tab-pane>
      <el-tab-pane label="Special Stats"></el-tab-pane>
      <!-- TODO 
        entry-browser (sorted by dates), 
        overview, 
        8k-view
        special stats
      datepicker -> disable dates-->
    </el-tabs>
  </div>
</template>

<script>
import Category from "@/view/Category.vue";
import Overview from "@/view/Overview.vue";

export default {
  name: "app",
  components: {
    Overview,
    Category
  },
  data() {
    return {};
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

  .chart {
    width: 500px;
    height: 100px;
    &.small {
      width: 300px;
      height: 150px;
    }
    &.big {
      width: 800px;
      height: 800px;
    }
  }

  .tabs {
    height: 100%;
  }

  .el-aside {
    text-align: center;
    background-color: white;
    border-right: solid 1px #e6e6e6;
    padding: 20px 20px;
    width: 300px;
    & > hr {
      color: #e6e6e6;
      margin: 20px;
    }
    & > *,
    & > .categories > * {
      margin: 10px;
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
      .chart {
        justify-self: center;
        &.big {
          grid-column: 1 / span 2;
        }
      }
    }
  }
}
</style>
