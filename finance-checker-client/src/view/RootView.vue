<template>
  <div class="root">
    <heading heading="Finance Checker" img="fc.svg" logo-left/>
    <!-- TODO logoleft -->
    <choices :choices="choices" big @select="execute"></choices>
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
    execute(choice) {
      this.$routeTo(choice.route);
    }
  }
};
</script>

<style lang="scss">
</style>
