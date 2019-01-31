<template>
  <div class="assigner">
    <h3>{{activeEntry.month + ' ' + activeEntry.day + ' '+ activeEntry.info + ' ' + activeEntry.amount}}</h3>
    <category-tree
      :categories="[{path: rootPath(activeEntry), data: subCat(activeEntry)}]"
      @onSelect="setCategory"
    ></category-tree>
    <div class="buttons-bar">
      <el-button
        v-if="isSelected"
        class="entity-button"
        icon="el-icon-plus"
        @click="newCategory"
      >New Category</el-button>
      <el-button class="entity-button" icon="el-icon-caret-right" @click="nextEntry">Skip</el-button>
      <el-button
        class="entity-button"
        icon="el-icon-arrow-right"
        @click="nextEntry"
        :disabled="!isSelected"
      ></el-button>
      <el-progress class="progress" :percentage="progress" :status="progressClass"></el-progress>
    </div>
  </div>
</template>


<script>
import { getCategoryTree } from "@/plugin/utils";
import CategoryTree from "@/components/CategoryTree";

export default {
  name: "EntriesToCategory",
  components: { CategoryTree },
  props: ["entries", "categories"],
  data() {
    return { activeEntry: {}, activeIndex: 0, selectedCategory: "" };
  },
  methods: {
    rootPath(entry) {
      return entry.amount > 0 ? "in" : "out";
    },
    subCat(entry) {
      const isIn = entry.amount > 0;
      if (isIn === true) {
        return getCategoryTree("in", this.categories);
      } else {
        return getCategoryTree("out", this.categories);
      }
    },
    nextEntry() {
      this.selectedCategory = "";
      if (this.activeIndex < this.entries.length - 1) {
        this.activeIndex++;
        this.activeEntry = this.entries[this.activeIndex];
      } else {
        this.$emit("next");
      }
    },
    setCategory(categorypath) {
      this.selectedCategory = categorypath;
    }
  },
  computed: {
    progress() {
      if (this.activeIndex === this.entries.length - 1) return 100;
      return Math.round((this.activeIndex / this.entries.length) * 100);
    },
    progressClass() {
      if (this.activeIndex === this.entries.length - 1) return "success";
      return null;
    },
    isSelected() {
      return !this.$isEmpty(this.selectedCategory);
    }
  },
  beforeMount() {
    this.activeEntry = this.entries[this.activeIndex];
  }
};
</script>

<style lang="scss">
.assigner {
  display: grid;
  grid-template: 1fr 3fr 1fr/ 1fr;
  min-width: 600px;
  & > * {
    margin: auto;
  }

  .buttons-bar {
    width: 100%;
    .progress {
      width: 100%;
    }
  }
}
</style>
