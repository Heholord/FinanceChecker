<template>
  <div class="root">
    <choices :choices="choices" big @select="execute"></choices>
    <!-- <button @click="routeTo('/manage')">
      <el-card class="box">
        <img src="@/assets/calculate.png" class="image">
        <div style="margin-top: 20px; padding: 14px;">
          <span>Manage data</span>
          <div class="bottom clearfix">
            <span class="sub">Start your journey</span>
          </div>
        </div>
      </el-card>
    </button>
    <button @click="routeTo('/visualize')">
      <el-card class="box">
        <img src="@/assets/euro.jpg" class="image">
        <div style="margin-top: 20px; padding: 14px;">
          <span>View data</span>
          <div class="bottom clearfix">
            <span class="sub">Enjoy what you have earned</span>
          </div>
        </div>
      </el-card>
    </button>-->
  </div>
</template>

<script>
import Choices from "@/components/Choices.vue";

export default {
  name: "RootView",
  components: { Choices },
  data() {
    return {
      choices: [
        {
          text: "Manage your data",
          subtext: "and start your journey",
          image: "calculate.png",
          route: "/manage"
        },
        {
          text: "View what you have",
          subtext: "and enjoy your growth",
          image: "euro.jpg",
          route: "/visualize"
        }
      ]
    };
  },
  methods: {
    routeTo(route) {
      this.$router.push(route);
    },
    execute(choice) {
      this.routeTo(choice.route);
    }
  }
};
</script>

<style lang="scss">
.root {
  margin: 50px;
}
</style>
