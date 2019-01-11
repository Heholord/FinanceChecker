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
            <div class="left">
              <el-card v-for="dataEntry in data" :key="dataEntry.date" class="box-card">
                <div slot="header" class="clearfix">
                  <span>{{dataEntry.date}}</span>
                </div>
                <el-table
                  show-summary
                  :summary-method="getSummaries"
                  :data="dataEntry.values"
                  class="table no-margin"
                >
                  <el-table-column prop="date" label="Date" width="100"></el-table-column>
                  <el-table-column prop="in" label="Income" width="100"></el-table-column>
                  <el-table-column prop="out" label="Outgoing" width="100"></el-table-column>
                  <el-table-column prop="diff" label="Difference" width="100"></el-table-column>
                  <el-table-column prop="save" label="Save" width="100"></el-table-column>
                </el-table>
              </el-card>
            </div>
            <div class="right"></div>
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
      noData: true,
      loaded: false,
      chartData: { datasets: [], labels: [] },
      displayDate: undefined,
      dateType: "year",
      data: []
    };
  },
  beforeMount: function() {
    this.setData("");
  },
  methods: {
    focusPicker() {
      this.displayDate = "undefined";
      if (this.dateType === "year") {
        this.$refs.yearPicker.focus();
      }
    },
    async reloadChart() {
      await this.setData();
    },
    async setData() {
      const dateList = this.$dateList(this.displayDate);
      this.noData = true;

      dateList.forEach(date => {
        let filteredData = this.$filterByCategory("", date);
        let values = [];
        if (Object.keys(filteredData.data).length > 0) {
          values = filteredData.sorting.map(key => {
            let income = 0;
            if (filteredData.data.in)
              income = Math.abs(
                Math.round(filteredData.data.in.values[key] * 100) / 100
              );
            let outgoing = 0;
            if (filteredData.data.out)
              outgoing = Math.abs(
                Math.round(filteredData.data.out.values[key] * 100) / 100
              );
            let save = 0;
            if (filteredData.data.save)
              save = Math.round(filteredData.data.save.values[key] * 100) / 100;
            return {
              date: key,
              in: income,
              out: outgoing,
              diff: Math.round((income - outgoing) * 100) / 100,
              save: save
            };
          });
          this.noData = false;
        }
        this.data.push({
          date: date,
          values: values
        });
      });
      this.loaded = true;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "Sum";
          return;
        }
        const values = data.map(item => {
          if (typeof item[column.property] === "string")
            return +item[column.property].replace(" €", "");
          else return item[column.property];
        });
        if ([1, 2, 3, 4].includes(index)) {
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            });
            sums[index] =
              Math.round(sums[index] * 100) / 100 + (index === 2 ? "" : " €");
          } else {
            sums[index] = "N/A";
          }
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
