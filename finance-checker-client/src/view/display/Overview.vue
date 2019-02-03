<template>
  <div class="contentView">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside>
        <i class="el-icon-date"></i>Date
        <br>
        <el-date-picker
          v-model="displayDate"
          type="year"
          placeholder="Pick a year"
          format="yyyy"
          value-format="yyyy"
          ref="yearPicker"
          @change="reloadChart"
          :picker-options="{disabledDate: disabledDates}"
        ></el-date-picker>
        <data-downloader></data-downloader>
      </el-aside>

      <el-container>
        <el-main>
          <div v-if="!noData" class="split">
            <div class="left">
              <el-collapse :value="data[0].date">
                <el-collapse-item
                  v-for="dataEntry in data"
                  :key="dataEntry.date"
                  :title="dataEntry.date"
                  :name="dataEntry.date"
                >
                  <el-table
                    show-summary
                    :summary-method="getSummaries"
                    :data="dataEntry.values"
                    class="table no-margin"
                  >
                    <el-table-column prop="date" label="Date" width="120"></el-table-column>
                    <el-table-column prop="in" label="Income" width="100"></el-table-column>
                    <el-table-column prop="out" label="Outgoing" width="100"></el-table-column>
                    <el-table-column prop="diff" label="Difference" width="100"></el-table-column>
                    <el-table-column prop="save" label="Save" width="100"></el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </div>
            <switchable-line-chart
              class="chart"
              :chartData="chartData"
              :stacked="false"
              v-if="loaded"
              @stacked="setTransparent"
            ></switchable-line-chart>
            <div class="right"></div>
          </div>
          <h1 v-if="noData">No data available</h1>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import SwitchableLineChart from "@/components/SwitchableLineChart.vue";
import DataDownloader from "@/components/DataDownloader";
import { mapGetters } from "vuex";

export default {
  name: "Overview",
  components: { SwitchableLineChart, DataDownloader },
  data() {
    return {
      noData: true,
      loaded: false,
      chartData: { datasets: [], labels: [] },
      displayDate: undefined,
      data: [],
      transparent: true
    };
  },
  computed: {
    ...mapGetters(["disabledDates"])
  },
  beforeMount: function() {
    this.setData("");
  },
  methods: {
    setTransparent(stacked) {
      this.transparent = !stacked;
      this.chartData = this.$createChartData(
        this.$store.getters.filterByCategory("", this.displayDate),
        this.transparent
      ).historical;
    },
    focusPicker() {
      this.displayDate = undefined;
    },
    async reloadChart() {
      await this.setData();
    },
    async setData() {
      // chartdata
      this.data = [];
      this.chartData = this.$createChartData(
        this.$store.getters.filterByCategory("", this.displayDate),
        this.transparent
      ).historical;
      const dateList = this.$store.getters.dateList(this.displayDate);
      this.noData = true;

      //entries with table
      if (!this.displayDate) {
        dateList.sort((e1, e2) => {
          return e1 > e2 ? -1 : 1;
        });
      }

      dateList.forEach(date => {
        var filterDate = date;
        if (this.displayDate) {
          filterDate += this.displayDate; // for filtering when a year has been selected, format September2018
        }
        let filteredData = this.$store.getters.filterByCategory("", filterDate);
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
              in: income + " €",
              out: outgoing + " €",
              diff: Math.round((income - outgoing) * 100) / 100 + " €",
              save: save * -1 + " €"
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
            sums[index] = Math.round(sums[index] * 100) / 100 + " €";
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
</style>
