<template>
  <div class="root contentView">
    <heading heading="Finance Checker"/>
    <div class="width-center h100 w100">
      <div class="center-content">
        <!-- TODO logoleft -->
        <choices :choices="choices" big @select="execute"></choices>
      </div>
    </div>
  </div>
</template>

<script>
import Choices from "@/components/Choices";
import Heading from "@/components/Heading";

export default {
  name: "RootView",
  components: { Choices, Heading },
  data() {
    return {
      choices: [
        {
          text: "Manage your data",
          subtext: "and start your journey",
          image: "manage.svg",
          route: "/manage"
        },
        {
          text: "View what you have",
          subtext: "and enjoy your growth",
          image: "data.svg",
          route: "/visualize"
        }
      ]
    };
  },
  methods: {
    execute(choice) {
      this.$routeTo(choice.route);
    }
  }
};
</script>

<style lang="scss" scoped>
.root {
  .center-content,
  .choices {
    height: 100%;
    margin: auto;
  }
}
</style>
