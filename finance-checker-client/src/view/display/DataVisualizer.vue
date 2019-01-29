<template>
  <div>
    <!-- TODO  
        8k-view
        special stats
        janika in/out bug   # check if fixed
        no data component (that offers to go to inquire page)
    -->
    <root-nav/>
    <el-tabs class="tabs" type="border-card">
      <el-tab-pane label="Overview">
        <Overview/>
      </el-tab-pane>
      <el-tab-pane label="Category Browser">
        <Category/>
      </el-tab-pane>
      <el-tab-pane label="Special Stats"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Category from "./Category";
import Overview from "./Overview";
import RootNav from "@/components/RootNav";

export default {
  name: "DataVisualizer",
  components: {
    Overview,
    Category,
    RootNav
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.master-menu {
  margin-bottom: 50px;
}

.contentView {
  height: 100%;
  .chart {
    min-height: 300px;
    min-width: 300px;
    &.small {
      width: 300px;
      height: 100px;
    }
    &.big {
      width: 1000px;
      height: 1000px;
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
      grid-template-columns: 2fr 1fr;
      grid-gap: 50px;
      .el-card.box-card {
        margin-bottom: 10px;
      }
      .chart {
        justify-self: center;
        position: relative;
        width: 75%;
        height: 75%;
      }
    }
  }
  .table {
    margin: 10px;
    margin-left: 50px;
    justify-self: center;
    align-self: start;
    &.no-margin {
      margin: 0;

      td {
        padding: 0.2em 0;
      }
    }
  }
}
</style>
