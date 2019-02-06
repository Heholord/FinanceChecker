const path = require("path");

module.exports = {
  lintOnSave: process.env.NODE_ENV !== "production",
  chainWebpack: config => {
    config.resolve.alias
      .set("@", path.resolve("src"))
      .set("vue$", "vue/dist/vue.common.js");
  },
  baseUrl: process.env.NODE_ENV === "production" ? "/FinanceChecker/" : "/"
};
