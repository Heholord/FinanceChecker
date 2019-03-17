<template>
  <div class="categories">
    <el-button v-if="categories.length > 1" round @click="click('')">
      <i class="el-icon-menu"></i> Categories
    </el-button>
    <el-input v-if="filterMode" placeholder="Filter keyword" v-model="filterText"></el-input>
    <el-menu class="treeMenu" @close="click" @open="click" :default-openeds="getRoots">
      <el-submenu v-for="category in categories" :key="category.path" :index="category.path">
        <template v-if="category.path === 'in'" slot="title">
          <i class="el-icon-plus"></i>Incomming
        </template>
        <template v-else-if="category.path === 'out'" slot="title">
          <i class="el-icon-minus"></i>Outgoing
        </template>
        <template v-else-if="category.path === 'save'" slot="title">
          <i class="el-icon-sort"></i>Save
        </template>
        <template v-else slot="title">
          <i class="el-icon-sort"></i>
          {{category.path}}
        </template>
        <el-tree
          v-if="!$isEmpty(activeCategories)"
          :default-expanded-keys="activeCategories"
          :data="category.data"
          :props="defaultProps"
          :filter-node-method="filterNode"
          :ref="'tree'+category.path"
          @node-click="click"
          node-key="id"
        ></el-tree>
        <el-tree
          v-else
          :default-expand-all="expandAll"
          :data="category.data"
          :props="defaultProps"
          :filter-node-method="filterNode"
          :ref="'tree'+category.path"
          @node-click="click"
        ></el-tree>
      </el-submenu>
    </el-menu>
  </div>
</template>


<script>
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
    getRoots() {
      return this.categories.map(el => el.path);
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
    }
  },
  watch: {
    filterText(val) {
      for (let category in this.categories) {
        this.$refs["tree" + this.categories[category].path].filter(val);
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
