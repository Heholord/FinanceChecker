import Vue from "vue";
import VueRouter from "vue-router";
import RootView from "@/view/RootView";
import DataDisplay from "@/view/display/DataDisplay";
import DataInquire from "@/view/inquire/DataInquire";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: "/",
      component: RootView
    },
    {
      path: "/display",
      component: DataDisplay
    },
    {
      path: "/inquire",
      component: DataInquire
    }
  ]
});
