<template>
  <div id="app">
    <a class="github-banner" href="https://github.com/Heholord/FinanceChecker">
      <img
        width="120"
        height="120"
        src="https://github.blog/wp-content/uploads/2008/12/forkme_left_darkblue_121621.png?resize=120%2C120"
        class="attachment-full size-full"
        alt="Fork me on GitHub"
        data-recalc-dims="1"
      >
    </a>
    <router-view></router-view>
    <!-- TODO  
      make an animation list (what would be nice if it'd be animated)
      think about the height of all views what should be the default height?
      rework utils (maybe in plugin)
    -->
    <div class="github-footer">
      <p>
        <a href="https://github.com/Heholord/FinanceChecker">
          This project is open source on
          <img
            src="@/assets/GitHub-Mark-Light-32px.png"
            class="image"
          >
          Check it out and contribute if you please
        </a>
      </p>
    </div>
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
  width: 100%;
  height: 100vh;
  margin: 0px;
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #fcfcfc;
    height: 100%;

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

    .github-banner {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 3;
    }

    .github-footer {
      position: fixed;
      bottom: 0;
      background: #121621;
      color: #ecedee;
      width: 100%;
      height: 60px;
      box-shadow: 3px -1px 8px 0px rgba(0, 0, 0, 0.8);
      a {
        transition: font-size 0.3s ease, text-shadow 0.3s ease;
        line-height: 2;
        img {
          margin: 0 4px;
        }
      }

      &:hover {
        a {
          font-size: 17px;
        }
      }
      a {
        color: white;
        text-decoration: none;
        &:hover {
          text-shadow: 0px 0px 3px rgba(255, 255, 255, 0.8);
        }
      }
    }
  }
  .el-tag {
    margin: 0 8px;
  }
}
</style>
