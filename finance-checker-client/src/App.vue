<template>
  <div id="app">
    <router-view></router-view>
    <!-- TODO  
      make an animation list (what would be nice if it'd be animated)
      think about the height of all views what should be the default height?
      rework utils (maybe in plugin),
      make all dialogs nicer (talk to user) [maybe make an talk interface like speaking bubbles or so]
    -->
    <a
      style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px"
      href="https://unsplash.com/@didwee?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge"
      target="_blank"
      rel="noopener noreferrer"
      title="Download free do whatever you want high-resolution photos from Didier Weemaels"
    >
      <span style="display:inline-block;padding:2px 3px">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white"
          viewBox="0 0 32 32"
        >
          <title>unsplash-logo</title>
          <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path>
        </svg>
      </span>
      <span style="display:inline-block;padding:2px 3px">Didier Weemaels</span>
    </a>
    <!-- Upload -->
    <a
      style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px"
      href="https://unsplash.com/@epicantus?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge"
      target="_blank"
      rel="noopener noreferrer"
      title="Download free do whatever you want high-resolution photos from Daria Nepriakhina"
    >
      <span style="display:inline-block;padding:2px 3px">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white"
          viewBox="0 0 32 32"
        >
          <title>unsplash-logo</title>
          <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path>
        </svg>
      </span>
      <span style="display:inline-block;padding:2px 3px">Daria Nepriakhina</span>
    </a>
    <div class="github-footer">
      <img src="@/assets/GitHub-Mark-Light-64px.png" class="image">
      <p>
        <a
          href="https://github.com/Heholord/FinanceChecker"
        >This project is open source on GitHub. Check it out and contribute if you please</a>
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
@import "base.scss";

body {
  width: 100%;
  height: 100vh;
  margin: 0px;
  box-sizing: border-box;

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #fcfcfc;
    height: 100%;

    .github-footer {
      position: fixed;
      bottom: 0;
      z-index: 10;
      background: #121621;
      color: #ecedee;
      width: 100%;
      height: 8vh;
      box-shadow: 3px -1px 8px 0px rgba(0, 0, 0, 0.8);
      p {
        margin-top: 30px;
        a {
          color: white;
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
        box-shadow: 3px -1px 8px 0px rgba(0, 0, 0, 0.8);
      }

      &:hover {
        a {
          font-size: 17px;
        }
      }
    }
  }
}
</style>
