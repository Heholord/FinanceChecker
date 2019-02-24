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
      <el-tab-pane label="Quick Upload">
        <QuickUpload/>
      </el-tab-pane>
      <el-tab-pane label="New Upload">
        <Upload/>
      </el-tab-pane>
      <el-tab-pane label="Download">
        <Download/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RootNav from "@/components/RootNav";
import Upload from "./Upload";
import Download from "./Download";
import QuickUpload from "./QuickUpload";

export default {
  name: "DataManagement",
  components: { RootNav, Upload, Download, QuickUpload }
};
</script>
