<template>
  <div class="category">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside width="300px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1', '2', 'in', 'out']" @click="alert">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-tickets"></i>Categories
            </template>
            <el-input placeholder="Filter keyword" v-model="filterText"></el-input>
            <el-submenu collapse="false" index="in">
              <template slot="title">
                <i class="el-icon-circle-plus-outline"></i>In
              </template>
              <el-tree
                :data="inCategory"
                :props="defaultProps"
                :filter-node-method="filterNode"
                ref="treeIn"
                @node-click="setChartData"
              ></el-tree>
            </el-submenu>
            <el-submenu index="out">
              <template slot="title">
                <i class="el-icon-remove-outline"></i>Out
              </template>
              <el-tree
                :data="outCategory"
                :props="defaultProps"
                :filter-node-method="filterNode"
                ref="treeOut"
                @node-click="setChartData"
              ></el-tree>
            </el-submenu>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-date"></i>Dates
            </template>
            <el-menu-item-group>
              <template slot="title">Group 1</template>
              <el-menu-item index="2-1">Option 1</el-menu-item>
              <el-menu-item index="2-2">Option 2</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-main>
          <doughnut class="doughnut" v-if="loaded" :chartData="chartData" :options="chartOptions"></doughnut>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Doughnut from "@/components/Doughnut.vue";
import palette from "google-palette";

export default {
  name: "Category",
  components: { Doughnut },
  data() {
    return {
      inCategory: [],
      outCategory: [],
      subcategories: {},
      filterText: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      loaded: false,
      chartData: { datasets: [], labels: [] },
      chartOptions: { cutoutPercentage: 60 }
    };
  },
  beforeMount: function() {
    this.inCategory = this.$getInCategory();
    this.outCategory = this.$getOutCategory();
  },
  methods: {
    filterNode(value, dataa) {
      if (!value) return true;
      return dataa.label.indexOf(value) !== -1;
    },
    setChartData(categoryPath) {
      this.loaded = false;
      this.chartData = { datasets: [], labels: [] };

      if (typeof categoryPath === "object") {
        categoryPath = categoryPath.id;
      }
      const category = this.$findCategory(categoryPath);
      let filteredData = this.$filterByCategory(category);
      this.chartData.datasets.push({
        data: filteredData.map(el => {
          return Math.abs(el.value);
        }),
        backgroundColor: palette("tol-dv", filteredData.length).map(hex => {
          return "#" + hex;
        })
      });
      this.chartData.labels.push(
        ...filteredData.map(el => {
          return el.category;
        })
      );
      this.loaded = true;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeIn.filter(val);
    }
  }
};
</script>

<style lang="scss">
.category {
  height: 100%;
  .el-aside {
    text-align: left;
    .el-menu .el-menu .el-submenu .el-menu {
      padding-left: 60px;
    }
  }
}
</style>
