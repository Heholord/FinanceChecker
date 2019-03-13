import Vue from "vue";
import VueRouter from "vue-router";
import RootView from "@/view/RootView";
import DataVisualizer from "@/view/display/DataVisualizer";
import DataManagement from "@/view/management/DataManagement";
import QuickUpload from "@/view/management/QuickUpload";
import Upload from "@/view/management/Upload";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: "/",
      component: RootView
    },
    {
      path: "/visualize",
      component: DataVisualizer
    },
    {
      path: "/manage",
      component: DataManagement,
      children: [
        { path: "/manage/upload/quick", component: QuickUpload },
        { path: "/manage/upload/setup", component: Upload }
      ]
    }
  ]
});
