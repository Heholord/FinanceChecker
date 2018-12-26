<template>
  <div class="category">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside>
        <el-menu
          :default-openeds="['categories', '2', 'in', 'out']"
          @close="setChartData"
          @open="setChartData"
        >
          <CategoryTree
            :inCategory="inCategory"
            :outCategory="outCategory"
            :saveCategory="saveCategory"
            @onSelect="setChartData"
          />
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
            <doughnut class="doughnut" v-if="loaded" :chartData="chartData"></doughnut>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Doughnut from "@/components/Doughnut.vue";
import CategoryTree from "@/components/CategoryTree.vue";

export default {
  name: "Overview",
  components: { Doughnut, CategoryTree },
  data() {
    return {
      inCategory: [],
      outCategory: [],
      saveCategory: [],
      loaded: false,
      chartData: { datasets: [], labels: [] },
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
    this.inCategory = this.$getCategoryTree("in");
    this.outCategory = this.$getCategoryTree("out");
    this.saveCategory = this.$getCategoryTree("save");
    this.setChartData("");
  },
  methods: {
    async setChartData(categoryPath) {
      this.loaded = false;

      let filteredData = this.$filterByCategory(categoryPath);
      this.chartData = this.$createChartData(filteredData);

      this.loaded = true;
    }
  }
};
</script>

<style lang="scss">
</style>
