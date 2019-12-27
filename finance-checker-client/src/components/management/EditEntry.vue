<template>
  <div class="edit-elem">
    <fieldset>
      <legend>
        <span class="number">1</span>
        General infos
      </legend>
      <el-input v-model.lazy="editEntry.info" placeholder="How is the entry called?"></el-input>
      <label for="date">When did that happen?</label>
      <el-date-picker
        id="date"
        v-model="selectedDate"
        placeholder="Choose a date"
        format="yyyy-MMM-dd"
        value-format="yyyy-MM-dd"
        @change="updateDate"
      ></el-date-picker>
      <label>About how much are we talking here?</label>
      <el-input v-model.lazy="editEntry.amount" placeholder="Quanta costa?" class="money"></el-input>
    </fieldset>
    <fieldset>
      <legend>
        <span class="number">2</span>
        Optional
      </legend>
      <label>Select a special category</label>
      <category-tree
        :categories="[rootCat]"
        :activeCategories="editEntry.category ? [editEntry.category] : []"
        :filterMode="false"
        @onSelect="selectCategory"
      ></category-tree>
    </fieldset>
    <el-button type="primary" @click="updateEntity()">Update</el-button>
  </div>
</template>


<script>
import { clone, moment } from "@/plugin/utils";
import { mapGetters } from "vuex";
import CategoryTree from "@/components/CategoryTree";

export default {
  components: { CategoryTree },
  name: "EditEntry",
  props: {
    entry: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editEntry: {},
      rootCat: "in"
    };
  },
  computed: {
    selectedDate: {
      get: function() {
        let editEntry = this.editEntry;
        return moment(
          editEntry.month + editEntry.year + editEntry.day,
          "MMMMYYYYD"
        ).format("YYYY-MM-DD");
      },
      set: function(newValue) {
        let date = moment(newValue, "YYYY-MM-DD");
        this.editEntry.year = date.format("YYYY");
        this.editEntry.month = date.format("MMMM");
        this.editEntry.day = date.format("D");
      }
    },
    ...mapGetters({ categories: "categories" })
  },
  methods: {
    selectCategory(categoryPath) {
      if (this.$isEmpty(categoryPath)) {
        delete this.editEntry.category;
      } else {
        this.editEntry.category = categoryPath;
      }
    },
    updateDate(newVal) {
      this.selectedDate = newVal;
    },
    updateEntity() {
      this.$emit("update", this.editEntry);
    }
  },
  beforeMount() {
    this.editEntry = clone(this.entry);
    this.rootCat = this.editEntry.amount > 0 ? "in" : "out";
  }
};
</script>

<style lang="scss">
.edit-elem {
  padding: 20px 20px;
  background: $neutral1;
  margin: 0;
  border-radius: 8px;
  font-family: Georgia, "Times New Roman", Times, serif;
  display: grid;
  grid-template-rows: auto auto auto;

  fieldset {
    border: none;
    margin: 10px;
    legend {
      font-size: 1.2em;
      margin-bottom: 10px;
      .number {
        background: $primary4;
        color: white;
        height: 30px;
        width: 30px;
        display: inline-block;
        font-size: 0.8em;
        margin-right: 4px;
        line-height: 30px;
        text-align: center;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
        border-radius: 50% 50% 50% 0;
      }
    }

    label {
      display: block;
      margin-bottom: 5px;
    }

    .el-input {
      margin: 0 0 0 00px;
      background: rgba(255, 255, 255, 0.2);
      margin-bottom: 30px;
      max-width: 500px;

      & > input {
        margin: 0;
      }

      &.money {
        max-width: 150px;
      }
    }
  }
  .primary {
    width: 90%;
    justify-self: center;
  }
}
</style>
