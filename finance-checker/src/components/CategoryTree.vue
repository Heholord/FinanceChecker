<template>
  <el-submenu index="categories">
    <template slot="title">
      <i class="el-icon-tickets"></i>Categories
    </template>
    <el-input placeholder="Filter keyword" v-model="filterText"></el-input>
    <el-submenu v-if="inCategory" index="in">
      <template slot="title">
        <i class="el-icon-circle-plus-outline"></i>In
      </template>
      <el-tree
        :data="inCategory"
        :props="defaultProps"
        :filter-node-method="filterNode"
        ref="treeIn"
        @node-click="click"
      ></el-tree>
    </el-submenu>
    <el-submenu v-if="outCategory" index="out">
      <template slot="title">
        <i class="el-icon-remove-outline"></i>Out
      </template>
      <el-tree
        :data="outCategory"
        :props="defaultProps"
        :filter-node-method="filterNode"
        ref="treeOut"
        @node-click="click"
      ></el-tree>
    </el-submenu>
  </el-submenu>
</template>


<script>
export default {
  name: "CategoryTree",
  props: ["inCategory", "outCategory"],
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      filterText: ""
    };
  },
  methods: {
    filterNode(value, dataa) {
      if (!value) return true;
      return dataa.label.indexOf(value) !== -1;
    },
    async click(categoryPath) {
      this.$emit("onSelect", categoryPath.id);
    }
  },
  watch: {
    filterText(val) {
      if (this.$refs.treeIn) {
        this.$refs.treeIn.filter(val);
      }
      if (this.$refs.treeOut) {
        this.$refs.treeOut.filter(val);
      }
    }
  }
};
</script>