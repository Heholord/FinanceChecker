<template>
  <div class="management contentView">
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
    <heading heading="Manage your data" img="manage-i.svg"></heading>
    <root-nav/>
    <div class="width-center">
      <div class="center-content">
        <div class="tabs">
          <selection
            v-if="$store.getters.hasData"
            :selections="[
              {key:'download', icon:'el-icon-download', text:'Download'},
              {key:'edit', icon:'el-icon-edit', text:'Editor'},
              {key:'upload', icon:'el-icon-upload', text:'Upload'},
              {key:'convert', icon:'el-icon-upload', text:'Convert'}]"
            default="upload"
            @selected="key => this.selected = key"
          />
          <selection
            v-else
            :selections="[{key:'upload', icon:'el-icon-upload', text:'Upload'},
            {key:'convert', icon:'el-icon-upload', text:'Convert'}]"
            default="upload"
            @selected="key => this.selected = key"
          />
          <div class="content">
            <Download v-if="selected === 'download'"/>
            <EntryBrowser v-if="selected === 'edit'"/>
            <div v-if="selected === 'upload'">
              <choices v-if="$route.path === '/manage'" :choices="uploadChoices" @select="route"></choices>
              <router-view></router-view>
            </div>
            <Converter v-if="selected === 'convert'"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RootNav from "@/components/RootNav";
import Choices from "@/components/Choices";
import Download from "./Download";
import Heading from "@/components/Heading";
import Selection from "@/components/Selection";
import EntryBrowser from "@/components/EntryBrowser";
import Converter from "./Converter";

export default {
  name: "DataManagement",
  components: {
    RootNav,
    Download,
    Choices,
    Heading,
    Selection,
    EntryBrowser,
    Converter
  },
  data() {
    return {
      uploadChoices: [
        {
          text: "Setup",
          subtext: "Everything that is great beginns with a setup",
          image: "setup.svg",
          route: "/manage/upload/setup"
        },
        {
          text: "Upload your existing data",
          subtext: "That's quick and easy",
          image: "quickupload.svg",
          route: "/manage/upload/quick"
        }
      ],
      selected: "upload"
    };
  },
  methods: {
    route(choice) {
      this.$routeTo(choice.route);
    },
    openUpload() {
      this.$refs.manTabs.value = "upload";
    }
  }
};
</script>

<style lang="scss">
</style>

