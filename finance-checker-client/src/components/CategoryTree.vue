<template>
  <div class="categories">
    <el-input v-if="filterMode" placeholder="Filter keyword" v-model="filterText"></el-input>
    <el-button @click="click('')">
      <i class="el-icon-menu"></i> Reset selection
    </el-button>
    <el-menu class="treeMenu" @close="click" @open="click" :default-openeds="categories">
      <el-submenu v-for="category in categories" :key="category" :index="category">
        <template v-if="category === 'in'" slot="title">
          <span class="mdi mdi-account-arrow-left" />Incomming
        </template>
        <template v-else-if="category === 'out'" slot="title">
          <span class="mdi mdi-account-arrow-right" />Outgoing
        </template>
        <template v-else-if="category === 'save'" slot="title">
          <span class="mdi mdi-bank-transfer" />Save
        </template>
        <template v-else slot="title">{{category}}</template>
        <el-tree
          v-if="!$isEmpty(activeCategories)"
          :default-expanded-keys="mutableActiveCategories"
          :current-node-key="getCurrent"
          :data="getCategoryTree(category)"
          :props="defaultProps"
          :filter-node-method="filterNode"
          :ref="category + '_tree'"
          @node-click="click"
          node-key="id"
          highlight-current
        ></el-tree>
        <el-tree
          v-else
          :default-expand-all="expandAll"
          :data="getCategoryTree(category)"
          :props="defaultProps"
          :filter-node-method="filterNode"
          :ref="category + '_tree'"
          @node-click="click"
          highlight-current
        ></el-tree>
      </el-submenu>
    </el-menu>
  </div>
</template>


<script>
import { mapGetters } from "vuex";
import { renderCategory } from "@/plugin/utils";

export default {
  name: "CategoryTree",
  props: {
    categories: Array,
    filterMode: {
      type: Boolean,
      default: true
    },
    expandAll: {
      type: Boolean,
      default: false
    },
    activeCategories: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      mutableActiveCategories: this.activeCategories,
      filterText: ""
    };
  },
  computed: {
    ...mapGetters({ storeCategories: "categories" }),
    getCurrent() {
      if (this.mutableActiveCategories.length === 1) {
        return this.mutableActiveCategories[0];
      }
      return undefined;
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      const returnVal = data.label.indexOf(value) !== -1;
      return returnVal;
    },
    click(categoryPath) {
      if (this.$isEmpty(categoryPath)) {
        this.filterText = "";
        this.mutableActiveCategories = [];
        this.$emit("onSelect", "");
      } else {
        const emitValue = categoryPath.id ? categoryPath.id : categoryPath; // in case of rootcategory there is no id.
        this.$emit("onSelect", emitValue);
      }
    },
    getCategoryTree(startingpoint) {
      return renderCategory(startingpoint, this.storeCategories[startingpoint]);
    }
  },
  watch: {
    filterText(val) {
      this.categories.forEach(category => {
        let tree = this.$refs[category + "_tree"];
        tree.filter(val);
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/variables.scss";

.categories {
  display: inline-block;
  min-width: 200px;
  & > * {
    margin-bottom: $space1;
  }

  .el-menu.treeMenu {
    text-align: left;
    border-right: none;
    padding: 0px;
    & > * {
      margin: 5px;
    }

    .el-submenu__title {
      padding: $space1;
      & + .el-menu {
        margin-left: $space1;
      }
    }
  }
}
</style>
