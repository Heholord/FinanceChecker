<template>
  <div class="history">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside width="300px" style="background-color: rgb(238, 241, 246)">
        <el-menu
          :default-openeds="['categories', '1', 'in', 'out']"
          @close="setChartData"
          @open="setChartData"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-date"></i>Dates
            </template>
            <div class="block">
              <el-date-picker v-model="displayDate" type="year" placeholder="Pick a year"></el-date-picker>
            </div>
          </el-submenu>
          <CategoryTree :outCategory="outCategory" @onSelect="setChartData"/>
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
  name: "Category",
  components: { CategoryTree, Doughnut },
  data() {
    return {
      inCategory: [],
      outCategory: [],
      subcategories: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      loaded: false,
      chartData: { datasets: [], labels: [] },
      displayDate: new Date(),
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
    async setChartData(categoryPath) {
      this.loaded = false;

      const category = this.$findCategory(categoryPath);
      let filteredData = this.$filterByCategory(category);
      this.chartData = this.$createChartData(filteredData);

      this.loaded = true;
    }
  }
};
</script>

<style lang="scss">
.history {
  height: 100%;
}
</style>
