import Vue from "vue";
import App from "./App.vue";

import Element from "element-ui";
import "@/assets/el_theme/index.css";
import "@/assets/Inter/inter.css";
import VueTour from "vue-tour";
import router from "./router";
import CategoryPlugin from "@/plugin/CategoryPlugin.vue";
import elemLocale from "element-ui/lib/locale/lang/en";
import vmodal from "vue-js-modal";
import store from "./plugin/store";
import VueLazyload from "vue-lazyload";

require("vue-tour/dist/vue-tour.css");

Vue.use(Element, { locale: elemLocale });
Vue.use(CategoryPlugin, { router });
Vue.use(vmodal);
Vue.use(VueLazyload);
Vue.use(VueTour);

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
