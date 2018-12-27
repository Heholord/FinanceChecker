<template>
  <div class="history">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside>
        <i class="el-icon-date"></i>Date
        <br>
        <el-radio-group v-model="dateType" @change="focusPicker" size="medium">
          <el-radio-button label="year"></el-radio-button>
          <el-radio-button label="month"></el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-if="dateType==='year'"
          v-model="displayDate"
          type="year"
          placeholder="Pick a year"
          format="yyyy"
          value-format="yyyy"
          ref="yearPicker"
          @change="reloadChart"
          :picker-options="{disabledDate: $getDisabledDates}"
        ></el-date-picker>
        <el-date-picker
          v-if="dateType==='month'"
          v-model="displayDate"
          type="month"
          placeholder="Pick a year"
          format="yyyy-MM"
          value-format="MMMMyyyy"
          ref="monthPicker"
          @change="reloadChart"
          :picker-options="{disabledDate: $getDisabledDates}"
        ></el-date-picker>
        <hr>
        <CategoryTree
          :categories="[{path: 'in', data: inCategory}, {path: 'out', data: outCategory}, {path: 'save', data: saveCategory}]"
          @onSelect="setChartData"
        />
      </el-aside>

      <el-container>
        <el-main>
          <div v-if="!noData" class="split">
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
          <h1 v-if="noData">No data available</h1>
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
      saveCategory: [],
      noData: true,
      lastCategoryPath: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      loaded: false,
      chartData: { datasets: [], labels: [] },
      displayDate: undefined,
      dateType: "year",
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
    focusPicker() {
      this.displayDate = "undefined";
      if (this.dateType === "year") {
        this.$refs.yearPicker.focus();
      } else {
        this.$refs.monthPicker.focus();
      }
    },
    async reloadChart() {
      await this.setChartData(this.lastCategoryPath);
    },
    async setChartData(categoryPath) {
      this.loaded = false;

      let filteredData = this.$filterByCategory(categoryPath, this.displayDate);
      if (Object.keys(filteredData).length > 0) {
        this.chartData = this.$createChartData(filteredData);
        this.noData = false;
      } else {
        this.noData = true;
      }

      this.loaded = true;
      this.lastCategoryPath = categoryPath;
    }
  }
};
</script>

<style lang="scss">
.history {
  height: 100%;
}
</style>
