<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss">
body {
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 30px;

    .split {
      display: grid;
      width: 100%;
      grid-template: auto / auto auto;
      grid-gap: 20px;
    }

    .success {
      color: #67c23a;
    }
  }
}
</style>
