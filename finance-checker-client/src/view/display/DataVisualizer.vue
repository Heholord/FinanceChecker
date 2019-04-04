<template>
  <div class="contentView dataVisualizer">
    <!-- TODO  
        8k-view
        special stats
        janika in/out bug   # check if fixed
        no data component (that offers to go to inquire page or offers an quickupload)
        loading from upload to entity browser does not work correctly (maybe split methods?)
    -->
    <heading heading="Data Visualizer" img="data-i.svg"/>
    <root-nav/>
    <div class="width-center">
      <div class="center-content">
        <div v-if="!$store.getters.hasData" class="tabs">
          <choices :choices="choices" title="You haven't uploaded any data yet" @select="execute"></choices>
        </div>
        <div v-else class="tabs">
          <div class="selection">
            <ul>
              <li
                @click="selected = 'overview'"
                @mouseover="over"
                @mouseleave="leave"
                :class="{active: isSelected('overview')}"
              >
                <i class="el-icon-view"></i> Overview
              </li>
              <li
                @click="selected = 'category'"
                @mouseover="over"
                @mouseleave="leave"
                :class="{active: isSelected('category')}"
              >
                <i class="el-icon-menu"></i> Category Browser
              </li>
              <li
                @click="selected = 'special'"
                @mouseover="over"
                @mouseleave="leave"
                :class="{active: isSelected('special')}"
              >
                <i class="el-icon-star-on"></i> Special Stats
              </li>
            </ul>
          </div>
          <div class="content">
            <Overview v-if="selected === 'overview'"/>
            <Category v-if="selected === 'category'"/>
            <Category v-if="selected === 'special'"/>
          </div>

          <el-tabs type="border-card">
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
      </div>
    </div>
  </div>
</template>

<script>
import Category from "./Category";
import Overview from "./Overview";
import Choices from "@/components/Choices.vue";
import RootNav from "@/components/RootNav";
import Heading from "@/components/Heading";

export default {
  name: "DataVisualizer",
  components: {
    Overview,
    Category,
    RootNav,
    Choices,
    Heading
  },
  data() {
    return {
      selected: "overview",
      isOver: false,
      choices: [
        {
          text: "Click here",
          subtext: "and I will bring you to the upload page",
          image: "upload.svg",
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
    },
    over() {
      this.isOver = true;
    },
    leave() {
      this.isOver = false;
    },
    isSelected(tab) {
      if (this.isOver === false) {
        return tab === this.selected;
      }
      return false;
    }
  }
};
</script>

<style lang="scss">
@import "@/variables.scss";

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
    > .selection {
      display: inline-block;
      ul {
        list-style: none;
        display: flex;
        height: $size2;
        justify-content: space-between;
        background-color: white;
        border-radius: 20px;
        box-shadow: $flying-shadow1;
        overflow: visible;
        padding: 0;
        transition: width 0.2s ease-out;

        > li {
          position: relative;
          max-width: $size7;
          padding: $space1;
          color: $neutral7;
          padding: $space1 $space2;
          border-radius: 20px;
          transition: width 0.1s ease-out, height 0.1s ease-out,
            background-color 0.1s ease-out, box-shadow 0.1s ease-out;

          > i {
            color: $neutral4;
          }

          &:hover,
          &.active {
            height: $size2 + 10px;
            top: -$space1;
            background-color: $neutral6;
            color: $neutral1;
            box-shadow: $flying-shadow2;
            padding: ($space2 - 3px) $space2;
            margin: 0;
            > i {
              color: $primary3;
            }
          }
        }
      }
    }
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
