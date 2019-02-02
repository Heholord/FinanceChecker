<template>
  <div class="assigner">
    <el-dialog v-if="shouldUse" title="Warning" :visible.sync="isShouldUse" width="50%" center>
      <span>
        The entry {{activeEntry.info}} has similarities with a categorized entry {{shouldUse.elem}} ({{shouldUse.similarity}}% similarity). Sould the new entry be placed in path
        <el-tag type="info">{{shouldUse.categoryPath.split(".").join(" > ")}}</el-tag>as well?
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="use(false)">No</el-button>
        <el-button type="primary" @click="use(true)">Yes</el-button>
      </span>
    </el-dialog>
    <em>{{elemText}}</em>
    <el-alert
      v-if="canInsertIntoCategory"
      type="success"
      :closable="false"
      show-icon
    >Currently category
      <el-tag type="info">{{selectedCategoryPrint}}</el-tag>is selected
    </el-alert>
    <el-alert
      v-else-if="isCategorySelected"
      type="warning"
      :closable="false"
      show-icon
    >The selected category
      <el-tag type="info">{{selectedCategoryPrint}}</el-tag>has subcategories, thus no entries can be added to this category.
      <br>Please specify the category or add a new subcategory.
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
        v-if="isCategorySelected"
        v-model="newCategoryPopover"
        placement="top"
        width="500"
      >
        <div class="popover content">
          <p>Do you want to create a new category in</p>
          <el-tag type="info">{{selectedCategoryPrint}}</el-tag>
          <el-alert v-if="isLeaf(selectedCategory)" type="warning" :closable="false" show-icon>
            <p>The selected category
              <el-tag type="info">{{selectedCategoryPrint}}</el-tag>contains entries. If you still decide to add a new subcategory to this category, the existing entries will be placed into an
              <el-tag type="info">{{selectedCategoryPrint}} > other</el-tag>subcategory.
            </p>
          </el-alert>
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
        @click="addElemToCategory"
        :disabled="!canInsertIntoCategory"
      >place here</el-button>
      <el-progress class="progress" :percentage="progress" :status="progressClass"></el-progress>
    </div>
  </div>
</template>


<script>
import { getCategoryTree, flatten, getCategoryPath } from "@/plugin/utils";
import CategoryTree from "@/components/CategoryTree";
const stringSimilarity = require("string-similarity");

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
      newCategoryPopover: false,
      shouldUse: false
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
      if (this.activeIndex < this.entries.length - 1) {
        this.activeIndex++;
        const elem = this.entries[this.activeIndex];
        const rootCat = this.rootPath(elem);
        const bestMatch = stringSimilarity.findBestMatch(
          elem.info,
          flatten(this.categories[rootCat])
        ).bestMatch;
        if (elem.category || flatten(this.categories).includes(elem.info)) {
          this.nextEntry();
        } else {
          this.setElemData(elem);
          if (bestMatch.rating > 0.5) {
            const categoryPath = getCategoryPath(
              rootCat,
              bestMatch.target,
              this.categories[rootCat]
            );
            const similarity = Math.round(bestMatch.rating * 100);
            this.shouldUse = {
              similarity,
              elem: bestMatch.target,
              categoryPath
            };
          }
        }
      } else {
        this.$emit("next");
      }
      this.selectedCategory = "";
    },
    use(shouldUse) {
      if (shouldUse) {
        this.selectedCategory = this.shouldUse.categoryPath;
        this.addElemToCategory();
      }
      this.shouldUse = false;
    },
    addElemToCategory() {
      if (!this.$isEmpty(this.selectCategory)) {
        this.$store.commit("addToCategory", {
          elem: this.activeEntry,
          categoryPath: this.selectedCategory
        });
        this.nextEntry();
      }
    },
    setNewCategoryName() {
      // TODO validate newCategory somehow (maybe veevalidate?)
      if (!this.$isEmpty(this.newCategory)) {
        this.selectedCategory = this.selectedCategory + "." + this.newCategory;
        this.$store.commit("buildCategory", this.selectedCategory);
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
    },
    isLeaf(categoryPath) {
      const parts = categoryPath.split(".");
      let categories = this.categories;
      for (let idx in parts) {
        const part = parts[idx];
        if (!categories[part]) {
          return false;
        } else {
          categories = categories[part];
        }
      }
      if (!Array.isArray(categories)) return false;
      return true;
    }
  },
  computed: {
    isShouldUse() {
      return this.shouldUse !== false;
    },
    progress() {
      if (this.activeIndex === this.entries.length - 1) return 100;
      return Math.round((this.activeIndex / this.entries.length) * 100);
    },
    progressClass() {
      if (this.activeIndex === this.entries.length - 1) return "success";
      return null;
    },
    isCategorySelected() {
      return !this.$isEmpty(this.selectedCategory);
    },
    selectedCategoryPrint() {
      return this.selectedCategory.replace(/\./gm, " > ");
    },
    canInsertIntoCategory() {
      return (
        !this.$isEmpty(this.selectedCategory) &&
        this.isLeaf(this.selectedCategory)
      );
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
  & > .el-alert {
    margin: 10px;
  }
}
</style>
