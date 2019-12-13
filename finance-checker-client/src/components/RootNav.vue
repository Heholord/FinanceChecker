<template>
  <div class="width-center">
    <div class="navbox center-content">
      <!--img v-if="img" class="headline-img" v-lazy="getImage" /-->
      <ul class="root-navigation title">
        <li
          class="br-soft"
          :class="{ active: isActive('/visualize') }"
          @click="$routeTo('/visualize')"
        >
          <img v-lazy="require('@/assets/avatars/data-s.svg')" />
          <span>Visualization</span>
        </li>
        <li class="br-soft" :class="{ active: isActive('/manage') }" @click="$routeTo('/manage')">
          <img v-lazy="require('@/assets/avatars/manage-s.svg')" />
          <span>Management</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    img: String
  },
  methods: {
    isActive(path) {
      return this.$route.path.startsWith(path);
    }
  },
  computed: {
    getImage() {
      return require("@/assets/" + this.img);
    }
  }
};
</script>

<style lang="scss" scoped>
$time: 0.1s ease-out;

$toptrans: top $time, margin $time, height $time, width $time,
  opacity 0.2s ease-out;

$square_size: $size1 + $size4;

.width-center {
  position: absolute;
  top: -0px;
  z-index: 9;
  widows: 100vw;
  transition: $toptrans;
  background-color: $neutral7;
  color: $neutral2;
  box-shadow: $flying-shadow1; //0 1px 2px $neutral1, inset 0 1px 2px hsla(0, 0%, 0%, 0.25);

  &:hover {
    top: 90px;
    > .center-content.navbox {
      > ul.root-navigation {
        > li {
          top: $space1;
          margin: $space2 $space3;
          > span {
            opacity: 1;
          }
          &.active {
            top: 0;
          }
        }
      }
    }
  }

  .center-content.navbox {
    transition: $toptrans;
    margin: 0;

    .headline-img {
      position: absolute;
      top: $space5;
      left: $space2;
      padding: $space1;
      background: $primary9;
      box-shadow: $flying-shadow2;
      border-radius: 50%;
      @include square($size5);
    }

    ul.root-navigation {
      margin: 0;
      height: $size4 + $size3;
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
        cursor: pointer;
        @include square($size4);
        background-color: $neutral3;
        box-shadow: $flying-shadow1;
        position: relative;
        bottom: -40px;
        z-index: 8;
        margin: 0 $space2;
        transition: $toptrans;
        > span {
          transition: $toptrans;
          position: absolute;
          left: -$space1;
          bottom: -20px;
          opacity: 0;
        }
        > img {
          padding: $space1;
          @include square($size4);
        }
        &.active {
          @include square($square_size);
          background-color: $neutral3;
          border: solid $space1 $primary5;
          bottom: -30px;
          box-shadow: $flying-shadow2;
          & > span {
            bottom: -25px;
          }
          // for shadow on active box
          &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: $square_size - 2 * $space1;
            height: $square_size - 2 * $space1;
            box-shadow: $flying-shadow1;
          }
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
