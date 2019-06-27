<template>
  <div class="contentView">
    <el-container>
      <el-aside>
        <p>Pick a date</p>
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
          :picker-options="{disabledDate: disabledDates}"
        ></el-date-picker>
        <el-date-picker
          v-if="dateType==='month'"
          v-model="displayDate"
          type="month"
          placeholder="Pick a month"
          format="yyyy-MM"
          value-format="MMMMyyyy"
          ref="monthPicker"
          :picker-options="{disabledDate: disabledDates}"
        ></el-date-picker>
        <p>Select a category</p>
        <CategoryTree :categories="['in', 'out','save']" @onSelect="setData"/>
        <data-downloader></data-downloader>
      </el-aside>

      <el-container>
        <el-main>
          <section class="visual-content">
            <bar-chart :chartData="weekChartData"/>
            <div class="flex-container">
              <div class="flex-item" v-for="(day,index) in week.total.avg" :key="index">
                <h2>{{dayName(index)}}</h2>
                <em>Sum / Count</em>
                <p>{{week.total.sum[index]}} / {{week.total.count[index]}}</p>
                <em>Average</em>
                <p>{{day}}</p>
              </div>
            </div>
          </section>
          <section class="visual-content">
            <bar-chart :chartData="monthChartData"/>
            <div class="flex-container">
              <div class="flex-item" v-for="(mon,index) in month.total.avg" :key="index">
                <h2>{{monthName(index)}}</h2>
                <em>Sum / Count</em>
                <p>{{month.total.sum[index]}} / {{month.total.count[index]}}</p>
                <em>Average</em>
                <p>{{mon}}</p>
              </div>
            </div>
          </section>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import CategoryTree from "@/components/CategoryTree.vue";
import BarChart from "@/components/charts/BarChart.vue";
import DataDownloader from "@/components/DataDownloader";
import { mapGetters } from "vuex";
import {
  moment,
  convertMonthToString,
  convertMonthToNr,
  forEachDay,
  forEachMonth
} from "@/plugin/utils";
import palette from "google-palette";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

export default {
  name: "SpecialStats",
  components: { CategoryTree, DataDownloader, BarChart },
  data() {
    return {
      week: {
        total: {
          sum: [],
          avg: [],
          count: []
        },
        percent: {
          sum: [],
          avg: [],
          count: []
        }
      },
      month: {
        total: {
          sum: [],
          avg: [],
          count: []
        },
        percent: {
          sum: [],
          avg: [],
          count: []
        }
      },
      displayDate: undefined,
      dateType: "year"
    };
  },
  computed: {
    ...mapGetters(["disabledDates", "data"]),
    weekChartData() {
      let backgrounds = palette("cb-Blues", 3).map(hex => {
        return "#" + hex;
      });
      const datasets = [
        {
          label: "Total",
          backgroundColor: backgrounds[0],
          data: this.week.percent.sum
        },
        {
          label: "Average per item",
          backgroundColor: backgrounds[1],
          data: this.week.percent.avg
        },
        {
          label: "Count",
          backgroundColor: backgrounds[2],
          data: this.week.percent.count
        }
      ];
      return {
        labels: days,
        datasets
      };
    },
    monthChartData() {
      let backgrounds = palette("cb-Blues", 3).map(hex => {
        return "#" + hex;
      });

      const datasets = [
        {
          label: "Total",
          backgroundColor: backgrounds[0],
          data: this.month.percent.sum
        },
        {
          label: "Average per item",
          backgroundColor: backgrounds[1],
          data: this.month.percent.avg
        },
        {
          label: "Count",
          backgroundColor: backgrounds[2],
          data: this.month.percent.count
        }
      ];
      return {
        labels: moment.months(),
        datasets
      };
    }
  },
  beforeMount: function() {
    this.setData("");
  },
  methods: {
    dayName(dayNr) {
      return days[dayNr];
    },
    monthName(monthNr) {
      return convertMonthToString(monthNr);
    },
    focusPicker() {
      //this.displayDate = "undefined";
      if (this.dateType === "year") {
        this.$refs.yearPicker.focus();
      } else {
        this.$refs.monthPicker.focus();
      }
    },
    async setData() {
      //(categoryPath) {

      // let filteredData = this.$store.getters.filter(
      //   categoryPath,
      //   this.displayDate
      // );
      // if (Object.keys(filteredData.data).length > 0) {

      const out = false;

      let entries = [];
      forEachDay(this.data, (year, month, day, dayData) => {
        let date = moment(year + month + day, "YYYYMMMMD");
        const dayofweek = date.isoWeekday() - 1;
        if (!Array.isArray(entries[dayofweek])) {
          entries[dayofweek] = [];
        }
        entries[dayofweek].push(...dayData);
      });

      if (out !== null) {
        entries = entries.map(elem => {
          if (out) return elem.filter(elem => parseFloat(elem.amount) < 0);
          return elem.filter(elem => parseFloat(elem.amount) > 0);
        });
      }

      this.week.total.count = entries.map(elem => elem.length);

      this.week.total.sum = [...entries];
      this.week.total.sum = this.week.total.sum.map((elem, index) => {
        if (elem)
          return (
            Math.round(
              elem.reduce((sum, elem) => sum + parseFloat(elem.amount), 0) * 100
            ) / 100
          );
        entries[index] = [];
        return 0;
      });

      this.week.total.avg = [...this.week.total.sum];
      this.week.total.avg = this.week.total.avg.map(
        (sum, index) =>
          Math.round((sum / this.week.total.count[index]) * 100) / 100
      );

      entries = [];
      forEachMonth(this.data, (year, month, monthData) => {
        const monthNr = convertMonthToNr(month) - 1;
        if (!Array.isArray(entries[monthNr])) {
          entries[monthNr] = [];
        }
        for (let values of Object.values(monthData)) {
          entries[monthNr].push(...values);
        }
      });

      if (out !== null) {
        entries = entries.map(elem => {
          if (out) return elem.filter(elem => parseFloat(elem.amount) < 0);
          return elem.filter(elem => parseFloat(elem.amount) > 0);
        });
      }

      this.month.total.count = entries.map(elem => elem.length);

      this.month.total.sum = [...entries];
      this.month.total.sum = this.month.total.sum.map((elem, index) => {
        if (elem)
          return (
            Math.round(
              elem.reduce((sum, elem) => sum + parseFloat(elem.amount), 0) * 100
            ) / 100
          );
        entries[index] = [];
        return 0;
      });

      this.month.total.avg = [...this.month.total.sum];
      this.month.total.avg = this.month.total.avg.map(
        (sum, index) =>
          Math.round((sum / this.month.total.count[index]) * 100) / 10
      );

      let sum = this.week.total.avg.reduce((s, e) => s + e);
      this.week.percent.avg = this.week.total.avg.map(
        e => Math.round((e / sum) * 1000) / 10
      );
      sum = this.week.total.sum.reduce((s, e) => s + e);
      this.week.percent.sum = this.week.total.sum.map(
        e => Math.round((e / sum) * 1000) / 10
      );
      sum = this.week.total.count.reduce((s, e) => s + e);
      this.week.percent.count = this.week.total.count.map(
        e => Math.round((e / sum) * 1000) / 10
      );

      sum = this.month.total.avg.reduce((s, e) => s + e);
      this.month.percent.avg = this.month.total.avg.map(
        e => Math.round((e / sum) * 1000) / 10
      );
      sum = this.month.total.sum.reduce((s, e) => s + e);
      this.month.percent.sum = this.month.total.sum.map(
        e => Math.round((e / sum) * 1000) / 10
      );
      sum = this.week.total.count.reduce((s, e) => s + e);
      this.month.percent.count = this.month.total.count.map(
        e => Math.round((e / sum) * 1000) / 10
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: $space2;
  padding-top: $space3;
  justify-content: space-around;
  .flex-item {
    width: $size6;
    box-shadow: $flying-shadow1;
  }
}
</style>
