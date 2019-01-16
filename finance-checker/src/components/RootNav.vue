<template>
  <el-menu :default-active="$route.path" class="master-menu" mode="horizontal" router>
    <el-menu-item index="/inquire">Inquire data</el-menu-item>
    <el-menu-item index="/display">Display data</el-menu-item>
  </el-menu>
</template>
    
<style lang="scss">
.master-menu {
  margin-bottom: 30px;
}
</style>