<template>
  <div>
    <div v-if="$route.path === '/manage'">
      <choices
        v-if="!$store.getters.hasData"
        title="Do you have some existing data from your last visit?"
        :choices="uploadChoices"
        @select="execute"
      ></choices>
      <choices
        v-else
        title="You have uploaded some data already. What do you wanna do with it?"
        :choices="uploadedChoices"
        @select="execute"
      ></choices>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import Choices from "@/components/Choices";
import { mapGetters } from "vuex";
import { convert } from "@/plugin/utils";

export default {
  name: "Upload",
  components: { Choices },
  data() {
    return {
      uploadChoices: [
        {
          text: "Upload your existing data",
          subtext: "That's quick and easy",
          image: "avatars/quickupload.svg",
          route: "/manage/upload/quick"
        },
        {
          text: "Setup new analysis",
          subtext: "Everything that is great beginns with preparation",
          image: "avatars/setup.svg",
          route: "/manage/upload/setup"
        }
      ],
      uploadedChoices: [
        {
          text: "Add raw data",
          subtext: "Enrichen your understanding of money",
          image: "avatars/add.svg",
          route: "/manage/upload/setup"
        },
        {
          text: "Got lost?",
          subtext: "I can you bring you to the visualisation page",
          image: "avatars/data.svg",
          route: "/visualize"
        },
        {
          text: "Clean analysis",
          subtext: "and delete existing data",
          image: "avatars/delete.svg",
          delete: true
        },
        {
          text: "Yeah, you'r right",
          subtext: "I just wanted to make sure I did",
          info: true
        }
      ]
    };
  },
  computed: {
    ...mapGetters({ entries: "data", categories: "categories" })
  },
  methods: {
    updateStore(data, doneAction) {
      data = convert(data);
      this.$store.dispatch("setData", data).then(() => {
        if (doneAction) doneAction();
      });
    },
    execute(choice) {
      if (choice.delete) this.updateStore({ data: {}, categories: {} });
      if (choice.route) this.$routeTo(choice.route);
    }
  }
};
</script>

<style lang="scss">
@import "@/variables.scss";
</style>
