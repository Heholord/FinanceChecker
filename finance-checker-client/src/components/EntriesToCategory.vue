<template>
  <div class="assigner">
    <em>{{elemText}}</em>
    <el-alert
      v-if="!$isEmpty(selectedCategory)"
      title="Selected category is "
      type="success"
      :closable="false"
      show-icon
    >
      <el-tag type="info" style="margin-left: 10px;">{{selectedCategoryPrint}}</el-tag>
    </el-alert>
    <el-alert v-else title="No category selected" type="info" :closable="false" show-icon></el-alert>
    <category-tree
      :categories="[{path: rootPath(activeEntry), data: subCat(activeEntry)}]"
      :filterMode="false"
      :expandAll="false"
      @onSelect="selectCategory"
    ></category-tree>
    <div class="buttons-bar">
      <el-popover
        class="btn new"
        v-if="isSelected"
        v-model="newCategoryPopover"
        placement="top"
        width="250"
      >
        <div class="popover content">
          <p>Do you want to create a new category in</p>
          <el-tag type="info">{{selectedCategoryPrint}}</el-tag>
          <p>The category should be named:</p>
          <el-input placeholder="category name" v-model="newCategory"></el-input>
          <div class="popover buttons">
            <el-button size="mini" type="text" @click="newCategoryPopover = false">cancel</el-button>
            <el-button type="primary" size="mini" @click="setNewCategoryName">confirm</el-button>
          </div>
        </div>
        <el-button
          icon="el-icon-plus"
          slot="reference"
          @click="newCategoryPopover = true"
        >New Category</el-button>
      </el-popover>
      <el-button class="btn skip" icon="el-icon-caret-right" @click="nextEntry">Skip</el-button>
      <el-button
        class="btn place"
        icon="el-icon-arrow-right"
        @click="nextEntry"
        :disabled="!isSelected"
      >place here</el-button>
      <el-progress class="progress" :percentage="progress" :status="progressClass"></el-progress>
    </div>
  </div>
</template>


<script>
import { getCategoryTree, flatten } from "@/plugin/utils";
import CategoryTree from "@/components/CategoryTree";

export default {
  name: "EntriesToCategory",
  components: { CategoryTree },
  props: ["entries", "categories"],
  data() {
    return {
      activeEntry: {},
      activeIndex: -1,
      selectedCategory: "",
      elemText: "",
      newCategory: "",
      newCategoryPopover: false
    };
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
        const elem = this.entries[this.activeIndex];
        if (elem.category || flatten(this.categories).includes(elem.info)) {
          this.nextEntry();
        } else {
          this.setElemData(elem);
        }
      } else {
        this.$emit("next");
      }
    },
    setNewCategoryName() {
      // TODO validate newCategory somehow (maybe veevalidate?)
      if (!this.$isEmpty(this.newCategory)) {
        this.selectedCategory = this.selectedCategory + "." + this.newCategory;
        this.$store.commit("addToCategory", this.selectedCategory);
      } else {
        this.selectedCategory = "";
      }
      this.newCategoryPopover = false;
    },
    selectCategory(categorypath) {
      this.selectedCategory = categorypath;
    },
    setElemData(elem) {
      if (this.rootPath(elem) === "in") {
        this.elemText =
          " (+) Incoming entry " +
          elem.info +
          " (" +
          elem.amount +
          "€) found on " +
          elem.month +
          " " +
          elem.day +
          "\n";
      } else {
        this.elemText =
          " (-) Outgoing entry " +
          elem.info +
          " (" +
          elem.amount +
          "€) found on " +
          elem.month +
          " " +
          elem.day +
          "\n";
      }
      this.activeEntry = elem;
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
    },
    selectedCategoryPrint() {
      return this.selectedCategory.replace(/\./gm, " > ");
    }
  },
  beforeMount() {
    this.nextEntry();
  }
};
</script>

<style lang="scss">
.assigner {
  display: grid;
  grid-template: 1fr auto auto 1fr/ 1fr;
  grid-gap: 10px;
  min-width: 600px;
  & > * {
    margin: auto;
  }

  .buttons-bar {
    display: grid;
    grid-template-areas:
      ". button1 button2 button3 ."
      "progress progress progress progress progress";
    grid-gap: 10px;
    width: 100%;

    .btn {
      &.place {
        grid-area: button3;
      }
      &.skip {
        grid-area: button2;
      }
      &.new {
        grid-area: button1;
      }
    }
    .progress {
      grid-area: progress;
      width: 100%;
    }
  }
}
.popover.content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  & > .buttons {
    margin-top: 10px;
    align-self: flex-end;
    justify-self: flex-end;
  }
}
</style>
