<template>
  <div class="contentView dataVisualizer">
    <!-- TODO  
        1) 8k-view (needs to be hidden 4 normal users)
        2) special stats
        3) janika in/out bug   # check if fixed
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
            <SpecialStats v-if="selected === 'special'"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SpecialStats from "./SpecialStats";
import Category from "./Category";
import Overview from "./Overview";
import Choices from "@/components/Choices.vue";
import RootNav from "@/components/RootNav";
import Heading from "@/components/Heading";
import Selection from "@/components/Selection";

export default {
  name: "DataVisualizer",
  components: {
    SpecialStats,
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
.el-main {
  > .flip-content {
    position: absolute;
    min-width: $size8;
    max-width: $size10;
    min-height: $size8;
    max-height: $size10;
  }
}
</style>
