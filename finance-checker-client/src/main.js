import Vue from "vue";
import App from "./App.vue";

import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import router from "./router";
import CategoryPlugin from "@/plugin/CategoryPlugin.vue";
import elemLocale from "element-ui/lib/locale/lang/en";
import moment from "vue-moment";
import vmodal from "vue-js-modal";

Vue.use(Element, { locale: elemLocale });
Vue.use(CategoryPlugin);
Vue.use(moment);
Vue.use(vmodal);

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
