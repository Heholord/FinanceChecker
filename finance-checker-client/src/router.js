import Vue from "vue";
import VueRouter from "vue-router";
import RootView from "@/view/RootView";
import DataVisualizer from "@/view/display/DataVisualizer";
import DataManagement from "@/view/management/DataManagement";
import ExistingDataUpload from "@/view/management/upload/ExistingDataUpload";
import DesignSystems from "@/view/systems/DesignSystems";
import NewDataUpload from "@/view/management/upload/NewDataUpload";
import DemoMaker from "@/view/management/DemoMaker";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: "/",
      component: RootView
    },
    {
      path: "/design",
      component: DesignSystems
    },
    {
      path: "/visualize",
      component: DataVisualizer
    },
    {
      path: "/manage",
      component: DataManagement,
      children: [
        { path: "/manage/upload/quick", component: ExistingDataUpload },
        { path: "/manage/upload/setup", component: NewDataUpload },
        { path: "/manage/demomaker", component: DemoMaker }
      ]
    }
  ]
});
