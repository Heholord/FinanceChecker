const path = require("path");

module.exports = {
  lintOnSave: process.env.NODE_ENV !== "production",
  configureWebpack: {
    devtool: "source-map"
  },
  chainWebpack: config => {
    config.resolve.alias
      .set("@", path.resolve("src"))
      .set("vue$", "vue/dist/vue.common.js");
  },
  publicPath: process.env.NODE_ENV === "production" ? "/FinanceChecker/" : "/",
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        // @/ is an alias to src/
        // so this assumes you have a file named `src/variables.scss`
        data: `@import "~@/variables.scss";`
      }
    }
  }
};
