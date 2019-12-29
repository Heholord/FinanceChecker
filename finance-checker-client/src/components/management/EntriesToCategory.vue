<template>
  <div class="assigner">
    <el-dialog
      v-if="shouldUse"
      title="I found a similar entry"
      :visible.sync="isShouldUse"
      width="50%"
      center
    >
      <span>
        The entry {{activeEntry.info}} has similarities with a categorized entry {{shouldUse.elem}} ({{shouldUse.similarity}}% similarity). Sould the new entry be placed in path
        <el-tag type="info">{{$readableCategoryPath(shouldUse.categoryPath)}}</el-tag>as well?
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="use(false)">No</el-button>
        <el-button type="primary" @click="use(true)">Yes</el-button>
      </span>
    </el-dialog>
    <p v-if="progressClass">You are done :)</p>
    <!-- make check animation here -->
    <div class="progress" :style="'width: ' + progress + 'vw'"></div>
    <div v-show="!progressClass" class="category-chooser">
      <em>{{elemText}}</em>
      <el-alert v-if="canInsertIntoCategory" type="success" :closable="false" show-icon>
        Currently category
        <el-tag type="info">{{selectedCategoryPrint}}</el-tag>is selected
      </el-alert>
      <el-alert v-else-if="isCategorySelected" type="warning" :closable="false" show-icon>
        The selected category
        <el-tag type="info">{{selectedCategoryPrint}}</el-tag>has subcategories, thus no entries can be added to this category.
        <br />Please specify the category or add a new subcategory.
      </el-alert>
      <el-alert v-else title="No category selected" type="info" :closable="false" show-icon></el-alert>
      <category-tree
        :categories="[rootPath(activeEntry)]"
        :activeCategories="[this.selectedCategory]"
        :filterMode="false"
        @onSelect="selectCategory"
      ></category-tree>
      <div class="buttons-bar">
        <el-popover
          v-if="isCategorySelected"
          class="btn new"
          placement="top"
          width="500"
          v-model="newCategoryPopover"
        >
          <div class="popover content">
            <p>Do you want to create a new category in</p>
            <el-tag type="info">{{selectedCategoryPrint}}</el-tag>
            <el-alert v-if="isLeaf(selectedCategory)" type="warning" :closable="false" show-icon>
              <p>
                The selected category
                <el-tag type="info">{{selectedCategoryPrint}}</el-tag>contains entries. If you still decide to add a new subcategory to this category, the existing entries will be placed into an
                <el-tag type="info">{{selectedCategoryPrint}} > other</el-tag>subcategory.
              </p>
            </el-alert>
            <label>The category should be named:</label>
            <el-input placeholder="category name" v-model="newCategory"></el-input>

            <div class="popover buttons">
              <el-button size="mini" type="text" @click="newCategoryPopover = false">cancel</el-button>
              <el-button type="primary" size="mini" @click="setNewCategoryName">confirm</el-button>
            </div>
          </div>
          <el-button icon="el-icon-plus" slot="reference">New Category</el-button>
        </el-popover>
        <el-button class="btn skip" type="info" icon="el-icon-caret-right" @click="nextEntry">Skip</el-button>
        <el-button
          class="btn place"
          icon="el-icon-arrow-right"
          type="success"
          @click="addElemToCategory"
          :disabled="!canInsertIntoCategory"
        >place here</el-button>
      </div>
    </div>
  </div>
</template>


<script>
import { flatten, getCategoryPath } from "@/plugin/utils";
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
    nextEntry() {
      if (this.activeIndex < this.entries.length - 1) {
        this.activeIndex++;
        const elem = this.entries[this.activeIndex];
        const rootCat = this.rootPath(elem);
        const categories = flatten(this.categories[rootCat]);
        if (elem.category || categories.includes(elem.info)) {
          this.nextEntry();
        } else {
          let bestMatch;
          if (categories.length > 0) {
            bestMatch = stringSimilarity.findBestMatch(elem.info, categories)
              .bestMatch;
          } else {
            bestMatch = { rating: 0 };
          }
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
      if (!this.$isEmpty(this.selectedCategory)) {
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
        this.newCategory = "";
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
          elem.year +
          " " +
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
          elem.year +
          " " +
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
      return this.$readableCategoryPath(this.selectedCategory);
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
$min-width: 250px;
.assigner {
  box-sizing: border-box;
  min-width: $min-width;

  .progress {
    position: fixed;
    top: 0;
    left: 0;
    height: $space1 + 3px;
    background-color: $support-positive2;
    transition: width 0.2s ease-out;
    z-index: 15;
    margin: 0;
    padding: 0;
  }

  & > .category-chooser {
    display: grid;
    grid-template: 1fr 1fr auto 1fr/ 1fr;
    grid-gap: 10px;
    margin: 10px 0 20px 0px;
    justify-items: center;

    & > * {
      margin: auto;
    }

    > .el-alert {
      max-width: 500px;
      min-width: $min-width;
      margin: 0 40px;
      justify-content: center;
    }

    .buttons-bar {
      display: grid;
      grid-template-areas: ". button1 button2 button3 .";
      grid-gap: 10px;
      width: 80%;

      .btn {
        &.place {
          grid-area: button3;
        }
        &.skip {
          grid-area: button2;
        }
        &.new {
          position: relative;
          grid-area: button1;
          & > button {
            position: absolute;
            right: 0;
          }
        }

        &.new,
        &.skip,
        &.place {
          margin: 0;
        }
      }
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
