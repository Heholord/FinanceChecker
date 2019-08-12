<template>
  <div class="heading size-height4 primary7 width-center">
    <div class="bar primary2" />
    <img class="logo" v-lazy="require('@/assets/fc_w_text_i.png')" @click="$routeTo('/')" />
    <div class="center-content content">
      <h1 class="headline thick">{{heading}}</h1>
      <img v-if="img" class="headline-img" v-lazy="getImage" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Heading",
  components: {},
  props: {
    img: String,
    heading: String
  },
  computed: {
    getImage() {
      return require("@/assets/" + this.img);
    }
  }
};
</script>

<style lang="scss">
.heading {
  width: 100vw;
  box-shadow: $flying-shadow3;
  text-align: left;
  z-index: 12;
  position: relative;
  padding: $space2;
  margin-bottom: $space4;

  .bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 0; //$space1;
  }

  img.logo {
    width: $size5;
    height: $size3;
    cursor: pointer;
  }

  .content {
    position: relative;
    text-align: center;
    max-width: $size11;
    min-width: $size10;
    padding: $space2;
    h1.headline {
      text-align: left;
      vertical-align: baseline;
      margin: 0;
    }
    .headline-img {
      position: absolute;
      top: -$space2;
      right: 0;
      padding: $space1;
      background: $primary9;
      box-shadow: $flying-shadow2;
      border-radius: 50%;
      @include square($size5);
    }
  }
}
</style>
