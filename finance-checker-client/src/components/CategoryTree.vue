<template>
  <div class="categories">
    <el-button v-if="categories.length > 1" round @click="click('')">
      <i class="el-icon-menu"></i> Categories
    </el-button>
    <el-input v-if="filterMode" placeholder="Filter keyword" v-model="filterText"></el-input>
    <el-menu class="treeMenu" @close="click" @open="click" :default-openeds="categories">
      <el-submenu v-for="category in categories" :key="category" :index="category">
        <template v-if="category === 'in'" slot="title">
          <span class="mdi mdi-account-arrow-left"/>Incomming
        </template>
        <template v-else-if="category === 'out'" slot="title">
          <span class="mdi mdi-account-arrow-right"/>Outgoing
        </template>
        <template v-else-if="category === 'save'" slot="title">
          <span class="mdi mdi-bank-transfer"/>Save
        </template>
        <template v-else slot="title">{{category}}</template>
        <el-tree
          v-if="!$isEmpty(activeCategories)"
          :default-expanded-keys="activeCategories"
          :data="getCategoryTree(category)"
          :props="defaultProps"
          :filter-node-method="filterNode"
          :ref="'tree'+category"
          @node-click="click"
          :current-node-key="getCurrent"
          node-key="id"
        ></el-tree>
        <el-tree
          v-else
          :default-expand-all="expandAll"
          :data="getCategoryTree(category)"
          :props="defaultProps"
          :filter-node-method="filterNode"
          :ref="'tree'+category"
          @node-click="click"
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
      filterText: ""
    };
  },
  computed: {
    ...mapGetters({ storeCategories: "categories" }),
    getCurrent() {
      if (this.activeCategories.length === 1) {
        return this.activeCategories[0];
      }
      return undefined;
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    click(categoryPath) {
      let emitValue = categoryPath;
      if (categoryPath.id) emitValue = categoryPath.id;
      this.$emit("onSelect", emitValue);
    },
    getCategoryTree(startingpoint) {
      let cat = renderCategory(
        startingpoint,
        this.storeCategories[startingpoint]
      );
      return cat;
    }
  },
  watch: {
    filterText(val) {
      for (let category in this.categories) {
        this.$refs["tree" + this.categories[category]].filter(val);
      }
    }
  }
};
</script>

<style lang="scss">
.categories {
  min-width: 200px;
  & > * {
    margin: 10px;
  }

  span,
  i {
    margin: 0px 5px 0px 5px;
  }

  .el-menu.treeMenu {
    text-align: left;
    border-right: none;
    padding: 0px;
    & > * {
      margin: 5px;
    }

    .el-submenu__title {
      & + .el-menu {
        margin-left: 30px;
      }
    }
  }
}
</style>
