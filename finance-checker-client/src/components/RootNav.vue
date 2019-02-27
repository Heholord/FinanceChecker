<template>
  <el-menu :default-active="$route.path" class="master-menu" mode="horizontal" router>
    <el-menu-item index="/manage">Management</el-menu-item>
    <el-menu-item index="/visualize">Visualization</el-menu-item>
  </el-menu>
</template>
    
<style lang="scss">
.master-menu {
  position: sticky;
  top: 0px;
  margin-bottom: 15px;
  z-index: 10;
}
</style>