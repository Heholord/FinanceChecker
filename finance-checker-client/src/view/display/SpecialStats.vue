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
          <div v-for="(day,index) in week.avg" :key="index">
            <h2>{{dayName(index)}}</h2>
            <em>Sum / Count</em>
            <p>{{week.sum[index]}} / {{week.count[index]}}</p>
            <em>Average</em>
            <p>{{day}}</p>
            <hr>
          </div>
        </el-main>
        <el-main>
          <div v-for="(mon,index) in month.avg" :key="index">
            <h2>{{monthName(index)}}</h2>
            <em>Sum / Count</em>
            <p>{{month.sum[index]}} / {{month.count[index]}}</p>
            <em>Average</em>
            <p>{{mon}}</p>
            <hr>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import CategoryTree from "@/components/CategoryTree.vue";
import DataDownloader from "@/components/DataDownloader";
import { mapGetters } from "vuex";
import {
  moment,
  monthToString,
  monthToNr,
  forEachDay,
  forEachMonth
} from "@/plugin/utils";

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
  components: { CategoryTree, DataDownloader },
  data() {
    return {
      week: {
        sum: [],
        avg: [],
        count: []
      },
      month: {
        sum: [],
        avg: [],
        count: []
      },
      displayDate: undefined,
      dateType: "year"
    };
  },
  computed: {
    ...mapGetters(["disabledDates", "data"])
  },
  beforeMount: function() {
    this.setData("");
  },
  methods: {
    dayName(dayNr) {
      return days[dayNr];
    },
    monthName(monthNr) {
      return monthToString(monthNr);
    },
    focusPicker() {
      //this.displayDate = "undefined";
      if (this.dateType === "year") {
        this.$refs.yearPicker.focus();
      } else {
        this.$refs.monthPicker.focus();
      }
    },
    async setData(categoryPath) {
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

      this.week.count = entries.map(elem => elem.length);

      this.week.sum = [...entries];
      this.week.sum = this.week.sum.map((elem, index) => {
        if (elem)
          return (
            Math.round(
              elem.reduce((sum, elem) => sum + parseFloat(elem.amount), 0) * 100
            ) / 100
          );
        entries[index] = [];
        return 0;
      });

      this.week.avg = [...this.week.sum];
      this.week.avg = this.week.avg.map(
        (sum, index) => Math.round((sum / this.week.count[index]) * 100) / 100
      );

      entries = [];
      forEachMonth(this.data, (year, month, monthData) => {
        const monthNr = monthToNr(month)-1;
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

      this.month.count = entries.map(elem => elem.length);

      this.month.sum = [...entries];
      this.month.sum = this.month.sum.map((elem, index) => {
        if (elem)
          return (
            Math.round(
              elem.reduce((sum, elem) => sum + parseFloat(elem.amount), 0) * 100
            ) / 100
          );
        entries[index] = [];
        return 0;
      });

      this.month.avg = [...this.month.sum];
      this.month.avg = this.month.avg.map(
        (sum, index) => Math.round((sum / this.month.count[index]) * 100) / 100
      );
    }
  }
};
</script>

<style lang="scss">
</style>
