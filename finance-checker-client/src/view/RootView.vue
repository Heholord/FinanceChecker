<template>
  <div class="root contentView">
    <heading heading="Finance Checker" />
    <div class="width-center h100 w100">
      <div v-if="!$store.getters.hasData" class="tabs">
        <choices
          :choices="emptyWorkspaceChoices"
          title="You have a clean workspace. Let's change that..."
          @select="execute"
          big
        ></choices>
      </div>
      <div v-else class="tabs">
        <choices :choices="choices" big @select="execute"></choices>
      </div>
    </div>
  </div>
</template>

<script>
import Choices from "@/components/Choices";
import Heading from "@/components/Heading";
import { convert } from "@/plugin/utils.js";

export default {
  name: "RootView",
  components: { Choices, Heading },
  data() {
    return {
      emptyWorkspaceChoices: [
        {
          text: "Upload transaction data",
          subtext: "and start the journey",
          image: "manage.svg",
          route: "/manage"
        },
        {
          text: "Launch the demo",
          subtext: "and get to know the environment",
          image: "test.svg",
          dummy: true,
          route: "/visualize"
        }
      ],
      choices: [
        {
          text: "Upload data from the bank",
          subtext: "and proceede the journey",
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
      if (choice.dummy) this.uploadDummy();
      if (choice.route) this.$routeTo(choice.route);
    },
    uploadDummy() {
      let mergeEntries = require("@/assets/data.demo.json");
      this.updateStore(mergeEntries);
    },
    updateStore(data, doneAction) {
      data = convert(data);
      this.$store.dispatch("setData", data).then(() => {
        if (doneAction) doneAction();
      });
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
