<template>
  <div>
    <!-- TODO  
        8k-view
        special stats
        janika in/out bug   # check if fixed
        no data component (that offers to go to inquire page or offers an quickupload)
        loading from upload to entity browser does not work correctly (maybe split methods?)
    -->
    <root-nav/>

    <el-card v-if="!$store.getters.hasData" class="box-card tabs">
      <choices :choices="choices" title="You haven't uploaded any data yet" @select="execute"></choices>
    </el-card>
    <el-tabs v-else class="tabs" type="border-card">
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-view"></i> Overview
        </span>
        <Overview/>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-menu"></i> Category Browser
        </span>
        <Category/>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-star-on"></i> Special Stats
        </span>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Category from "./Category";
import Overview from "./Overview";
import Choices from "@/components/Choices.vue";
import RootNav from "@/components/RootNav";

export default {
  name: "DataVisualizer",
  components: {
    Overview,
    Category,
    RootNav,
    Choices
  },
  data() {
    return {
      choices: [
        {
          text: "Click here",
          subtext: "and I will bring you to the upload page",
          image: "upload.jpg",
          route: "/manage"
        },
        {
          text: "... or stay on this page",
          subtext: "There is no need to hurry",
          info: true
        }
      ]
    };
  },
  methods: {
    execute(choice) {
      this.$routeTo(choice.route);
    }
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
    & > div {
      margin: 30px 10px;
      & > * {
        margin: 10px;
      }
      & > p {
        margin-bottom: 0px;
        & > i {
          margin-right: 6px;
        }
      }
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
