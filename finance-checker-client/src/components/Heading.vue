<template>
  <div class="heading primary7 width-center">
    <div class="bar primary2" />
    <img class="logo" v-lazy="require('@/assets/fc_w_text_i.png')" @click="$routeTo('/')" />
    <div class="center-content content">
      <h1 class="headline thick">{{heading}}</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "Heading",
  components: {},
  props: {
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
  padding: $space1;
  margin-bottom: $space4;
  height: $size4 + $size1;

  .bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 0; //$space1;
  }

  img.logo {
    width: $size6;
    height: $size4;
    margin: 0 $space4;
    cursor: pointer;
  }

  .content {
    position: relative;
    text-align: left;
    max-width: $size11;
    min-width: $size10;
    padding: $space2;
    h1.headline {
      vertical-align: baseline;
      margin: 0 0 0 $space3;
    }
  }
}
</style>
