<template>
  <div id="app">
    <router-view></router-view>
    <!-- TODO  
      1) make an animation list (what would be nice if it'd be animated)
      2) rework utils (maybe in plugin),
      3) make all dialogs nicer (talk to user) [maybe make an talk interface like speaking bubbles or so]
      Don't offer yes, no answers
      4) Uniform forms numbered steps 1, 2, 3 with drops (border-radius: 50% 50% 50% 0%)
      5) Tagline: Cause spreadsheats are not enought
    -->
    <div class="github-footer size-h4 primary9 width-center">
      <div class="center-content">
        <img src="@/assets/GitHub-Mark-Light-64px.png" class="image">
        <p>
          <a
            class="article"
            href="https://github.com/Heholord/FinanceChecker"
          >This project is open source on GitHub. Check it out and contribute if you please</a>
        </p>
      </div>
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
@import "base.scss";

#app {
  text-align: center;
  height: 100%;

  .github-footer {
    position: sticky;
    bottom: 0;
    z-index: 10;
    width: 100vw;
    box-shadow: 1px -1px 3px 0px rgba(0, 0, 0, 0.8);

    p {
      margin-top: $space1;
      margin-left: $space5;
      a {
        color: $primary1;
        text-decoration: none;
        transition: font-size 0.3s ease, text-shadow 0.3s ease;
        line-height: 2;
        &:hover {
          text-shadow: 0px 0px 3px rgba(255, 255, 255, 0.8);
        }
      }
    }
    img {
      position: absolute;
      top: -25px;
      margin: 0px 4px;
      width: 60px;
      height: 60px;
      background-color: #121621;
      border-radius: 50%;
      border: solid #121621 5px;
      box-shadow: 1px -3px 3px -3px rgba(0, 0, 0, 0.8);
    }

    &:hover {
      a {
        font-size: 17px;
      }
    }
  }
}
</style>
