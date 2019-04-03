<template>
  <div class="navbox">
    <ul class="root-navigation title">
      <li class="br-soft">
        <img v-lazy="require('@/assets/dataSuccess.svg')">
        <span>Management</span>
      </li>
      <li class="br-soft">
        <img v-lazy="require('@/assets/dataSuccess.svg')">
        <span>Visualization</span>
      </li>
    </ul>
  </div>
  <!-- <el-menu :default-active="$route.path" class="master-menu" mode="horizontal" router>
    <el-menu-item index="/manage">Management</el-menu-item>
    <el-menu-item index="/visualize">Visualization</el-menu-item>
  </el-menu>-->
</template>
    
<style lang="scss">
@import "@/variables.scss";

$toptrans: top 0.2s ease-out, margin 0.2s ease-out, height 0.2s ease-out,
  width 0.2s ease-out, border-radius 0.2s ease-out;

.navbox {
  background: $neutral2;
  z-index: 9;
  position: absolute;
  top: -80px;
  width: 100vw;
  transition: $toptrans;
  min-width: $size9;

  &:hover {
    top: -80px;
    > ul.root-navigation {
      height: $size7;
      border-radius: 300px;
      margin: 0 $space5;
      > li {
        top: 140px;
        margin: $space3;
      }
    }
  }

  ul.root-navigation {
    background-color: $neutral7;
    color: $neutral2;
    // @include make-in-shadow($neutral1);
    box-shadow: 0 1px 0 $neutral1, inset 0 0 5px hsla(0, 0%, 0%, 0.25);
    border-radius: 80%;
    margin: 0 $space1;
    height: $size6;
    z-index: 7;
    display: flex;
    padding: 0;
    justify-content: center;
    list-style: none;
    overflow: hidden;
    transition: $toptrans;

    > li {
      @include square($size4);
      background-color: $primary4;
      box-shadow: $flying-shadow1;
      position: relative;
      top: 170px;
      z-index: 8;
      margin: $space2;
      transition: $toptrans;
      > span {
        position: absolute;
        left: -$space1;
        bottom: -20px;
      }
      > img {
        padding: $space1;
        @include square($size4);
      }
    }
  }
}

ul.master-menu {
  position: sticky;
  top: 0px;
  margin-bottom: 20px;
  z-index: 8;
  box-shadow: $flying-shadow3;

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