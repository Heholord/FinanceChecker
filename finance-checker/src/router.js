import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import Category from "@/view/Category.vue";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: "/",
      component: App,
      children: [
        {
          // UserProfile will be rendered inside User's <router-view>
          // when /user/:id/profile is matched
          path: "profile",
          component: Category
        }
      ]
    }
  ]
});
