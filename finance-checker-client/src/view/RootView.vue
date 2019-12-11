<template>
  <div class="root contentView">
    <heading heading="Finance Checker" />
    <div class="width-center h100 w100">
      <div class="hint">
        <el-button
          circle
          class="mdi mdi-36px mdi-routes"
          :class="{ active: tourIsActive }"
          @click="showTour()"
        ></el-button>
      </div>
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

    <v-tour
      name="myTour"
      :steps="tourSteps"
      :callbacks="tourCallbacks"
    ></v-tour>
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
      tourIsActive: false,
      tourCallbacks: {
        onStart: () => {
          this.tourIsActive = true;
        },
        onStop: () => {
          this.tourIsActive = false;
          this.$store.commit("setToured");
        }
      }
    };
  },
  computed: {
    tourSteps() {
      let steps = [];
      steps.push({
        target: ".choice-container > .box",
        content:
          "<p class='article'>Have you been here before? Then upload your data and continue your analyzes. It is also the place <strong> to get started.<strong></p>",
        params: {
          placement: "right"
        }
      });

      let secondText =
        "Here you can find your uploaded data in nice graphs. Check it out, you might get surprised.";
      if (!this.$store.getters.hasData) {
        secondText =
          "If you are new and you wanna see what this site can do for you, then you wanna check out the <strong>demo</strong> first. <br>" +
          "It's just dummy data so don't worry about a squandering lifestyle.";
      }
      steps.push({
        target: ".box + .box",
        content: "<p class='article'>" + secondText + "</p>",
        params: {
          placement: "left"
        }
      });

      if (this.$store.getters.isfirstTimeTour) {
        steps.push({
          target: ".hint",
          content:
            "<p class='article'><strong>One last thing ...</strong> <br> I will always be up here, on every page. So just hit me up and I'll explain you what comes next. <br> Go on now ... you are ready.</p>",
          params: {
            placement: "left"
          }
        });
      }

      return steps;
    }
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
    },
    showTour() {
      this.$tours["myTour"].start();
    }
  },
  mounted: function() {
    if (this.$store.getters.isfirstTimeTour) {
      this.showTour();
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
.hint {
  position: absolute;
  top: $space6;
  right: $space3;
  // from https://codepen.io/colewaldrip/pen/bdZVGd
  button {
    font-size: 1.5rem;
    color: $neutral1;
    background-color: $neutral5;
    position: relative;
    border: none;
    border-radius: 50%;
    padding: $space2;
    margin: $space1;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: color 0.2s ease, background-color 0.2s ease, transform 0.3s ease;
    &:hover,
    &.active {
      color: $neutral5;
      background-color: $neutral1;
      // background-color: transparent;
      transform: rotate(10deg);
      cursor: pointer;
      box-shadow: none;
      &:after {
        transform: scale(1);
        box-shadow: 10px 0 20px rgba(0, 0, 0, 0.19),
          6px 0 6px rgba(0, 0, 0, 0.23);
      }
    }
    &:after {
      content: "";
      width: 100%;
      height: 100%;
      border: $neutral5 solid 2px;
      transform: scale(0.75);
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 50%;
      transition: all 0.3s ease;
    }
  }
}
</style>
