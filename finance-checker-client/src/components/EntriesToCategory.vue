<template>
  <div class="assigner">
    <div v-for="entry in join(entries)" :key="entry.month + entry.day + entry.info + entry.amount">
      <h3>{{entry.month + entry.day + entry.info + entry.amount}}</h3>
      {{entry.amount}}
      <!-- category-tree :categories="[{path: rootPath(entry), data: subCat(entry)}]"/>
      <div class="buttons-bar"></div-->
    </div>
    <el-progress :percentage="50" status="success"></el-progress>
  </div>
</template>


<script>
import { getCategoryTree, join } from "@/plugin/utils";
import CategoryTree from "@/components/CategoryTree";

export default {
  name: "CategoryTree",
  components: { CategoryTree },
  props: ["entries", "categories"],
  data() {
    return {};
  },
  methods: {
    join(obj) {
      return join(obj);
    },
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
    }
  },
  computed: {}
};
</script>

<style lang="scss">
</style>
