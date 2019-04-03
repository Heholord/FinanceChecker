<template>
  <div class="heading size-height4 padding3 primary7 width-center">
    <div class="bar primary2"/>
    <div class="center-content content">
      <h1 class="headline thick">{{heading}}</h1>
      <img v-if="img" class="headline-img" v-lazy="getImage">
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
@import "@/variables.scss";

.heading {
  width: 100vw;
  box-shadow: $flying-shadow2;
  margin: 0 0 $space6 0;
  text-align: left;
  z-index: 12;
  position: relative;

  .bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 0; //$space1;
  }

  .content {
    position: relative;
    text-align: center;
    max-width: $size11;
    min-width: $size10;
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
