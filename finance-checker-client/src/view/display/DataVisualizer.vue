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
          <selection
            :selections="[{key:'overview', icon:'el-icon-view', text:'Overview'},
              {key:'category', icon:'el-icon-menu', text:'Category Browser'},
              {key:'special', icon:'el-icon-star-on', text:'Special Stats'}]"
            default="overview"
            @selected="key => this.selected = key"
          />
          <div class="content">
            <Overview v-if="selected === 'overview'"/>
            <Category v-if="selected === 'category'"/>
            <Category v-if="selected === 'special'"/>
          </div>
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
import Selection from "@/components/Selection";

export default {
  name: "DataVisualizer",
  components: {
    Overview,
    Category,
    RootNav,
    Choices,
    Heading,
    Selection
  },
  data() {
    return {
      selected: "overview",
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

  .el-aside {
    text-align: left;
    color: $neutral7;
    width: $size5;

    p {
      font-weight: $fw4;
      font-size: $fs4;
      background-color: $neutral7;
      color: transparent;
      text-shadow: 0px 1px 3px hsla(220, 35%, 94%, 0.5);
      background-clip: text;
      margin-top: $space2;
      margin-bottom: $space1;
    }

    .el-input__inner {
      background-color: $neutral1;
      color: $neutral9;
      font-size: $fs3;
      @include make-in-shadow($neutral1);
      border: none;

      &::placeholder {
        color: $neutral8;
      }

      & ~ .el-input__prefix,
      & ~ .el-input__suffix {
        color: $neutral6;
        font-size: $fs2;
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
