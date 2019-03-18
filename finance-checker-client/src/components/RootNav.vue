<template>
  <el-menu :default-active="$route.path" class="master-menu" mode="horizontal" router>
    <el-menu-item index="/manage">Management</el-menu-item>
    <el-menu-item index="/visualize">Visualization</el-menu-item>
  </el-menu>
</template>
    
<style lang="scss">
@import "@/variables.scss";

ul.master-menu {
  position: sticky;
  top: 0px;
  margin-bottom: 20px;
  z-index: 10;
  box-shadow: $shadow;

  display: flex;
  justify-content: space-around;
  background: #f5f7fa;
  & > li.el-menu-item {
    width: 80%;
    margin: auto;

    &:hover {
      background-color: #f5f7fa;
      border-bottom: 2px solid #9ec0e4;
    }
  }
}
</style>