<template>
  <div class="category">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside width="300px" style="background-color: rgb(238, 241, 246)">
        <el-menu
          :default-openeds="['1', '2', 'in', 'out']"
          @close="setChartData"
          @open="setChartData"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-tickets"></i>Categories
            </template>
            <el-input placeholder="Filter keyword" v-model="filterText"></el-input>
            <el-submenu index="in">
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
          <div class="split">
            <el-table :data="tableData" class="table">
              <el-table-column prop="date" label="Date" width="150"></el-table-column>
              <el-table-column prop="name" label="Name" width="120"></el-table-column>
              <el-table-column prop="state" label="State" width="120"></el-table-column>
              <el-table-column prop="city" label="City" width="120"></el-table-column>
              <el-table-column prop="address" label="Address" width="300"></el-table-column>
              <el-table-column prop="zip" label="Zip" width="120"></el-table-column>
            </el-table>
            <doughnut class="doughnut" v-if="loaded" :chartData="chartData" :options="chartOptions"></doughnut>
          </div>
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
      chartOptions: { cutoutPercentage: 60 },
      tableData: [
        {
          date: "2016-05-03",
          name: "Tom",
          state: "California",
          city: "Los Angeles",
          address: "No. 189, Grove St, Los Angeles",
          zip: "CA 90036"
        },
        {
          date: "2016-05-02",
          name: "Tom",
          state: "California",
          city: "Los Angeles",
          address: "No. 189, Grove St, Los Angeles",
          zip: "CA 90036"
        },
        {
          date: "2016-05-04",
          name: "Tom",
          state: "California",
          city: "Los Angeles",
          address: "No. 189, Grove St, Los Angeles",
          zip: "CA 90036"
        },
        {
          date: "2016-05-01",
          name: "Tom",
          state: "California",
          city: "Los Angeles",
          address: "No. 189, Grove St, Los Angeles",
          zip: "CA 90036"
        },
        {
          date: "2016-05-08",
          name: "Tom",
          state: "California",
          city: "Los Angeles",
          address: "No. 189, Grove St, Los Angeles",
          zip: "CA 90036"
        },
        {
          date: "2016-05-06",
          name: "Tom",
          state: "California",
          city: "Los Angeles",
          address: "No. 189, Grove St, Los Angeles",
          zip: "CA 90036"
        },
        {
          date: "2016-05-07",
          name: "Tom",
          state: "California",
          city: "Los Angeles",
          address: "No. 189, Grove St, Los Angeles",
          zip: "CA 90036"
        }
      ]
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
    async setChartData(categoryPath) {
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
      this.$refs.treeOut.filter(val);
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
  .el-main {
    .split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 50px;
      .table {
        margin: 10px;
        margin-left: 50px;
        justify-self: center;
        align-self: start;
      }
      .doughnut {
        justify-self: center;
      }
    }
  }
}
</style>
