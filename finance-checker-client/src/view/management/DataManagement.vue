<template>
  <div class="management">
    <!-- TODO  
       custom parsing,
       html and/or json (make hirachy clear) 
        desicion component for:
          -> upload existing data
            -> add new data
              -> entry browser, category browser, ect
            -> entry browser, category browser, ect
          -> upload bank data (html, csv)
            -> usual flow

       options(delete, add, modify, special category) in entity view 
       make a finish page (with nice animations)
       jump to finish page option when store data and category exits
    -->
    <root-nav/>
    <el-tabs class="tabs" type="border-card">
      <el-tab-pane v-if="$store.getters.hasData">
        <span slot="label">
          <i class="el-icon-download"></i> Download
        </span>
        <Download/>
      </el-tab-pane>
      <el-tab-pane v-if="$store.getters.hasData">
        <span slot="label">
          <i class="el-icon-edit"></i> Edit
        </span>
        <Download/>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-upload"></i> Upload
        </span>
        <choices v-if="$route.path === '/manage'" :choices="uploadChoices" @select="route"></choices>
        <router-view></router-view>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RootNav from "@/components/RootNav";
import Choices from "@/components/Choices";
import Download from "./Download";

export default {
  name: "DataManagement",
  components: { RootNav, Download, Choices },
  data() {
    return {
      uploadChoices: [
        {
          text: "Setup",
          subtext: "Everything that is great beginns with a setup",
          image: "setup.jpg",
          route: "/manage/upload/setup"
        },
        {
          text: "Upload your existing data",
          subtext: "That's quick and easy",
          image: "easy.jpg",
          route: "/manage/upload/quick"
        }
      ]
    };
  },
  methods: {
    route(choice) {
      this.$routeTo(choice.route);
    }
  }
};
</script>

<style lang="scss">
</style>

