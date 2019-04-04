<template>
  <div class="width-center">
    <div class="navbox center-content">
      <ul class="root-navigation title">
        <li class="br-soft" :class="{active: isActive('/manage')}" @click="$routeTo('/manage')">
          <img v-if="isActive('/manage')" v-lazy="require('@/assets/manage-i-s.svg')">
          <img v-else v-lazy="require('@/assets/manage-s.svg')">
          <span>Management</span>
        </li>
        <li
          class="br-soft"
          :class="{active: isActive('/visualize')}"
          @click="$routeTo('/visualize')"
        >
          <img v-if="isActive('/visualize')" v-lazy="require('@/assets/data-i-s.svg')">
          <img v-else v-lazy="require('@/assets/data-s.svg')">
          <span>Visualization</span>
        </li>
      </ul>
    </div>
  </div>
  <!-- <el-menu :default-active="$route.path" class="master-menu" mode="horizontal" router>
    <el-menu-item index="/manage">Management</el-menu-item>
    <el-menu-item index="/visualize">Visualization</el-menu-item>
  </el-menu>-->
</template>

<script>
export default {
  methods: {
    isActive(path) {
      return path === this.$route.path;
    }
  }
};
</script>

    
<style lang="scss" scoped>
@import "@/variables.scss";

$toptrans: top 0.2s ease-out, margin 0.2s ease-out, height 0.2s ease-out,
  width 0.2s ease-out, border-radius 0.2s ease-out;

.width-center {
  position: absolute;
  top: -30px;
  z-index: 9;
  widows: 100vw;
  transition: $toptrans;
  background-color: $neutral7;
  color: $neutral2;
  box-shadow: 0 1px 200px $neutral1, inset 0 0 6px hsla(0, 0%, 0%, 0.25);

  &:hover {
    top: 45px;
    > .center-content.navbox {
      > ul.root-navigation {
        > li {
          top: 10px;
          margin: $space3;
        }
      }
    }
  }

  .center-content.navbox {
    transition: $toptrans;
    width: $size10;
    margin: 0;

    ul.root-navigation {
      margin: 0 $space2;
      height: $size5;
      z-index: 7;
      display: flex;
      padding: 0;
      justify-content: flex-start;
      list-style: none;
      overflow: hidden;
      transition: $toptrans;
      width: $size10;
      border: none;

      > li {
        @include square($size4);
        background-color: $neutral3;
        box-shadow: $flying-shadow1;
        position: relative;
        top: 110px;
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

        &.active {
          background-color: $primary7;
          // border: solid 3px $support-positive2;
        }
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