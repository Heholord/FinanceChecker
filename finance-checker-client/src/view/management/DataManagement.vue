<template>
  <div class="management contentView">
    <!-- TODO  
       1) html and/or json (make hirachy clear) 
       2) desicion component for:
          -> upload (q: do you have some data to upload? a: upload data, take a tour)
            -> upload existing data
              -> then add new data
            -> upload bank data (html, csv)
              -> select bank:
              -> select country, then list banks in choice component with unified logo style
              -> add new data
              -> choose merge strategy in choice component (newest, merge non empty days, merge months, merge years, merge everything)]
                -> name side effects of each merge strategy (maybe in bulletpoints)
                -> explain what it does (i.e: creates new days, extends days, extends months)
                -> maybe make negative and positive bulletpoints
            -> then entry browser, category browser, ect
          -> take a tour
        
      3)
      4) options(delete, add, modify, special category) in entity view 
      5) make a finish page (with nice animations)
      6) jump to finish page option when store data and category exits
      7) loading from upload to entity browser does not work correctly (maybe split methods?). check if fixed
    -->
    <heading heading="Manage your data" img="manage-i.svg"></heading>
    <root-nav />
    <div class="width-center">
      <div class="center-content">
        <div class="tabs">
          <selection
            v-if="$store.getters.hasData"
            :selections="[
          {key:'download', icon:'el-icon-download', text:'Download'},
          {key:'edit', icon:'el-icon-edit', text:'Editor'},
          {key:'upload', icon:'el-icon-upload', text:'Upload'}]"
            default="upload"
            @selected="key => this.selected = key"
          />
          <selection
            v-else
            :selections="[{key:'upload', icon:'el-icon-upload', text:'Upload'}]"
            default="upload"
            @selected="key => this.selected = key"
          />
          <div class="content">
            <Download v-if="selected === 'download'" />
            <EntryBrowser v-if="selected === 'edit'" />
            <div v-if="selected === 'upload'">
              <choices v-if="$route.path === '/manage'" :choices="uploadChoices" @select="route"></choices>
              <router-view></router-view>
            </div>
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

export default {
  name: "DataManagement",
  components: {
    RootNav,
    Download,
    Choices,
    Heading,
    Selection,
    EntryBrowser
  },
  data() {
    return {
      uploadChoices: [
        {
          text: "Upload your existing data",
          subtext: "That's quick and easy",
          image: "quickupload.svg",
          route: "/manage/upload/quick"
        },
        {
          text: "Setup",
          subtext: "Everything that is great beginns with a setup",
          image: "setup.svg",
          route: "/manage/upload/setup"
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

