<template>
  <div class="assigner">
    <progress/>
  </div>
</template>


<script>
export default {
  name: "CategoryTree",
  props: ["categories"],
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
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    async click(categoryPath) {
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
.el-menu.treeMenu {
  text-align: left;
  border-right: none;
  padding: 0px;
  & > * {
    margin: 5px;
  }

  .el-submenu__title {
    margin-left: -20px;
  }
}
</style>
