<template>
  <div class="contentView">
    <modal :adaptive="true" :delay="1" height="auto" scrollable name="entry">
      <div class="entry-list">
        <el-table
          show-summary
          :summary-method="getEntriesSummaries"
          :data="entries"
          class="table no-margin"
        >
          <el-table-column prop="date" label="Date" width="100"></el-table-column>
          <el-table-column prop="info" label="Info" width="400"></el-table-column>
          <el-table-column prop="amount" label="Amount" width="100"></el-table-column>
        </el-table>
      </div>
    </modal>
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
          :picker-options="{disabledDate: disabledDates}"
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
          :picker-options="{disabledDate: disabledDates}"
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
            <el-table
              show-summary
              @row-contextmenu="showEntries"
              :summary-method="getSummaries"
              :data="tableData"
              class="table"
              oncontextmenu="return false;"
            >
              <el-table-column prop="category" label="Category" width="160"></el-table-column>
              <el-table-column prop="sum" label="Sum" width="100"></el-table-column>
              <el-table-column prop="count" label="# of Entries" width="100"></el-table-column>
              <el-table-column prop="avg" label="Average " width="100"></el-table-column>
              <el-table-column prop="std" label="Standard Deviation" width="150"></el-table-column>
            </el-table>
            <doughnut class="chart don" v-if="loaded" :chartData="chartData.general"></doughnut>
            <switchable-line-chart
              class="chart"
              :chartData="chartData.historical"
              :stacked="true"
              v-if="loaded"
              @stacked="setTransparent"
            ></switchable-line-chart>
          </div>
          <h1 v-if="noData">No data available</h1>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Doughnut from "@/components/Doughnut.vue";
import SwitchableLineChart from "@/components/SwitchableLineChart.vue";
import CategoryTree from "@/components/CategoryTree.vue";
import { getCategoryTree } from "@/plugin/utils";
import { mapGetters } from "vuex";

export default {
  name: "Category",
  components: { CategoryTree, Doughnut, SwitchableLineChart },
  data() {
    return {
      inCategory: [],
      outCategory: [],
      saveCategory: [],
      noData: true,
      entries: [],
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
      tableData: [],
      transparent: false
    };
  },
  computed: {
    ...mapGetters(["disabledDates", "categories"])
  },
  beforeMount: function() {
    this.inCategory = getCategoryTree("in", this.categories);
    this.outCategory = getCategoryTree("out", this.categories);
    this.saveCategory = getCategoryTree("save", this.categories);
    this.setChartData("");
  },
  methods: {
    setTransparent(stacked) {
      this.transparent = !stacked;
      this.setChartData(this.lastCategoryPath);
    },
    focusPicker() {
      //this.displayDate = "undefined";
      if (this.dateType === "year") {
        this.$refs.yearPicker.focus();
      } else {
        this.$refs.monthPicker.focus();
      }
    },
    showEntries(row) {
      let filteredData = this.$store.getters.filterByCategory(
        this.lastCategoryPath,
        this.displayDate
      );
      let category = filteredData.data[row.category];
      this.entries = category.entries;
      this.$modal.show("entry");
    },
    async reloadChart() {
      await this.setChartData(this.lastCategoryPath);
    },
    async setChartData(categoryPath) {
      this.loaded = false;

      let filteredData = this.$store.getters.filterByCategory(
        categoryPath,
        this.displayDate
      );
      if (Object.keys(filteredData.data).length > 0) {
        this.chartData = this.$createChartData(filteredData, this.transparent);
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
      if (["", "save"].includes(this.lastCategoryPath)) {
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = "Under the line";
            return;
          }
          if (index === 1) {
            const inValue = +data
              .filter(item => item.category === "in")[0]
              .sum.replace(" €", "");

            const outValue = +data
              .filter(item => item.category === "out")[0]
              .sum.replace(" €", "");

            sums[index] = Math.round((inValue - outValue) * 100) / 100 + " €";
          }
        });
      } else {
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
            if ([1, 2].includes(index)) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              });
            } else if (index === 3) {
              sums[index] = sums[index - 2].replace(" €", "") / sums[index - 1];
            } else if (index === 4) {
              sums[index] = this.$std(values);
            }
            sums[index] =
              Math.round(sums[index] * 100) / 100 + (index === 2 ? "" : " €");
          } else {
            sums[index] = "N/A";
          }
        });
      }

      return sums;
    },
    getEntriesSummaries(param) {
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
        if ([2].includes(index)) {
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
.don {
  grid-row: 1 / span 2;
  grid-column: 2;
}
</style>