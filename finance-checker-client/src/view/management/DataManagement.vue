<template>
  <div class="management">
    <!-- TODO  
       custom parsing,
       html and/or json
       options(delete, add, modify, special category) in entity view 
       category view,
       make a finish page (with nice animations)
       jump to finish page option when store data and category exits
    -->
    <root-nav/>
    <el-tabs class="tabs" type="border-card">
      <el-tab-pane label="Upload">
        <Upload/>
      </el-tab-pane>
      <el-tab-pane label="Download">
        <!--Download/-->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RootNav from "@/components/RootNav";
import Upload from "./Upload";

export default {
  name: "DataManagement",
  components: { RootNav, Upload }
};
</script>
