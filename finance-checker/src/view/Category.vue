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
            <el-table show-summary :summary-method="getSummaries" :data="tableData" class="table">
              <el-table-column prop="category" label="Category" width="160"></el-table-column>
              <el-table-column prop="sum" label="Sum" width="100"></el-table-column>
              <el-table-column prop="count" label="# of Entries" width="100"></el-table-column>
              <el-table-column prop="avg" label="Average " width="100"></el-table-column>
              <el-table-column prop="std" label="Standard Deviation" width="150"></el-table-column>
            </el-table>
            <doughnut class="chart small" v-if="loaded" :chartData="chartData.general"></doughnut>
            <line-chart class="chart big" v-if="loaded" :chartData="chartData.historical"></line-chart>
          </div>
          <h1 v-if="noData">No data available</h1>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Doughnut from "@/components/Doughnut.vue";
import LineChart from "@/components/LineChart.vue";
import CategoryTree from "@/components/CategoryTree.vue";

export default {
  name: "Category",
  components: { CategoryTree, Doughnut, LineChart },
  data() {
    return {
      inCategory: [],
      outCategory: [],
      saveCategory: [],
      noData: true,
      lastCategoryPath: "",
      loaded: false,
      chartData: {
        general: {
          datasets: [],
          labels: []
        },
        historical: {
          datasets: [],
          labels: []
        }
      },
      displayDate: undefined,
      dateType: "year",
      tableData: []
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
      //this.displayDate = "undefined";
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
        this.tableData = this.$createTableData(filteredData);
        this.noData = false;
      } else {
        this.noData = true;
      }

      this.loaded = true;
      this.lastCategoryPath = categoryPath;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "Summary";
          return;
        }
        const values = data.map(item => {
          if (typeof item[column.property] === "string")
            return +item[column.property].replace(" €", "");
          else return item[column.property];
        });
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          });
          if (index === 3) {
            sums[index] = sums[index] / values.length;
          } else if (index === 4) {
            sums[index] = this.$std(values);
          }
          sums[index] =
            Math.round(sums[index] * 100) / 100 + (index === 2 ? "" : " €");
        } else {
          sums[index] = "N/A";
        }
      });

      return sums;
    }
  }
};
</script>

<style lang="scss">
.history {
  height: 100%;
}
</style>
