<template>
  <div id="app">
    <router-view></router-view>
    <!-- TODO  
      make an animation list (what would be nice if it'd be animated)
      think about the height of all views what should be the default height?
      rework utils (maybe in plugin)
    -->
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
  margin: 0;
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;

    ul.master-menu {
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
      & + .tabs {
        margin: 50px;
      }
    }

    .split {
      display: grid;
      width: 100%;
      grid-template: auto / auto auto;
      grid-gap: 50px;
    }

    .success {
      color: #67c23a;
    }
  }
  .el-tag {
    margin: 0 8px;
  }
}
</style>
