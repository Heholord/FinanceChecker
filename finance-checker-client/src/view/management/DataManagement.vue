<template>
  <div class="management contentView">
    <!-- TODO  
       1) html and/or json (make hirachy clear) 
       2) desicion component for:
          -> upload existing data
              -> ✔️ then add new data
            -> upload bank data (html, csv)
              -> ✔️ select bank:
                -> ✔️ select country, then list banks in choice component with unified logo style
              -> add new data
                -> allow specificitaion of what should be imported (from when to when and not the full file)
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
    <heading heading="Manage your data"></heading>
    <root-nav img="manage-i.svg" />
    <div class="width-center">
      <div class="center-content">
        <div class="tabs">
          <selection
            v-if="$store.getters.hasData"
            :selections="[
              { key: 'download', icon: 'el-icon-download', text: 'Download' },
              { key: 'edit', icon: 'el-icon-edit', text: 'Editor' },
              { key: 'upload', icon: 'el-icon-upload', text: 'Upload' }
            ]"
            default="upload"
            @selected="key => (this.selected = key)"
          />
          <div class="content">
            <Download v-if="selected === 'download'" />
            <EntryBrowser v-if="selected === 'edit'" edit />
            <Upload v-if="selected === 'upload'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RootNav from "@/components/RootNav";
import Download from "./Download";
import Upload from "./upload/Upload";
import Heading from "@/components/Heading";
import Selection from "@/components/Selection";
import EntryBrowser from "@/components/management/EntryBrowser";

export default {
  name: "DataManagement",
  components: {
    RootNav,
    Download,
    Upload,
    Heading,
    Selection,
    EntryBrowser
  },
  data() {
    return {
      selected: "upload"
    };
  }
};
</script>

<style lang="scss"></style>
