<template>
  <div class="history">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside>
        <i class="el-icon-date"></i>Date
        <br>
        <el-radio-group v-model="dateType" @change="focusPicker" size="medium">
          <el-radio-button label="all"></el-radio-button>
          <el-radio-button label="year"></el-radio-button>
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
      </el-aside>

      <el-container>
        <el-main>
          <div v-if="!noData" class="split">
            <el-table show-summary :data="tableData" class="table">
              <el-table-column prop="date" label="Date" width="150"></el-table-column>
              <el-table-column prop="name" label="Name" width="120"></el-table-column>
              <el-table-column prop="state" label="State" width="120"></el-table-column>
              <el-table-column prop="city" label="City" width="120"></el-table-column>
              <el-table-column prop="address" label="Address" width="300"></el-table-column>
              <el-table-column prop="zip" label="Zip" width="120"></el-table-column>
            </el-table>
            <line-chart class="linechart" v-if="loaded" :chartData="chartData"></line-chart>
          </div>
          <h1 v-if="noData">No data available</h1>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import LineChart from "@/components/LineChart.vue";

export default {
  name: "Overview",
  components: { LineChart },
  data() {
    return {
      in: [],
      out: [],
      save: [],
      noData: true,
      defaultProps: {
        children: "children",
        label: "label"
      },
      loaded: false,
      chartData: { datasets: [], labels: [] },
      displayDate: undefined,
      dateType: "year",
      tableData: []
    };
  },
  beforeMount: function() {
    this.setChartData("");
  },
  methods: {
    focusPicker() {
      this.displayDate = "undefined";
      if (this.dateType === "year") {
        this.$refs.yearPicker.focus();
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
