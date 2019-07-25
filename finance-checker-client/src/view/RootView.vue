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

    <v-tour name="myTour" :steps="tourSteps"></v-tour>
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
      ],
      tourSteps: [
        {
          target: ".choice-container > .box",
          content:
            "<p class='article'>Have you been here before? Then upload your data and continue your analyzes. It is also the place <strong> to get started.<strong></p>"
        },
        {
          target: ".box + .box",
          content:
            "<p class='article'>If you are new and you wanna see what this site can do for you, then you wanna check out the demo first. " +
            "It's just dummy data so better don't take the records too seriously.</p>"
        },
        {
          target: ".tabs",
          content:
            "<p class='article'>One last thing ... I will always be up here, on every page. So just hit me up and I'll explain you what comes next. But now go on ... you are ready.</p>",
          params: {
            placement: "bottom"
          }
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
  },
  mounted: function() {
    this.$tours["myTour"].start();
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
