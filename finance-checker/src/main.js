import Vue from "vue";
import App from "./App.vue";

import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import router from "./router";
import CategoryPlugin from "@/plugin/CategoryPlugin.vue";
import elemLocale from "element-ui/lib/locale/lang/en";
const data = require("@/assets/data.json");
const categories = require("@/assets/categorizer.json");

Vue.use(Element, { locale: elemLocale });
Vue.use(CategoryPlugin, { data, categories });

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
