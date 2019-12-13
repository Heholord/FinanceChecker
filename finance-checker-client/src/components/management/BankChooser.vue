<template>
  <div class="bank-chooser">
    <choices
      :choices="toChoices(objectAsList(banks))"
      :small="!$isEmpty(region)"
      @select="setRegion"
    />
    <choices
      v-if="!$isEmpty(region)"
      :choices="toChoices(objectAsList(banks[region].children))"
      :small="!$isEmpty(bank)"
      @select="setBank"
    />
    <choices
      v-if="!$isEmpty(bank)"
      :choices="toChoices(objectAsList(banks[region].children[bank].children))"
      @select="setInputType"
    />
  </div>
</template>


<script>
import banks from "@/assets/banks/banks";
import Choices from "@/components/Choices";

export default {
  name: "BankChooser",
  components: { Choices },
  data() {
    return {
      region: "",
      bank: "",
      inputType: ""
    };
  },
  computed: {
    banks() {
      return banks;
    }
  },
  methods: {
    objectAsList(object) {
      return Object.keys(object).map(elem => {
        return { id: elem, ...object[elem] };
      });
    },
    toChoices(list) {
      let choice = list.map(entry => {
        return {
          text: entry.label,
          id: entry.id,
          image: entry.image ? entry.image : false
        };
      });
      return choice;
    },
    setRegion(value) {
      this.region = value.id;
      this.bank = false;
      this.inputType = false;
    },
    setBank(value) {
      this.bank = value.id;
      this.inputType = false;
    },
    setInputType(value) {
      this.inputType = value.id;
      this.$emit("selected", [this.region, this.bank, this.inputType]);
    }
  }
};
</script>

<style lang="scss">
</style>
