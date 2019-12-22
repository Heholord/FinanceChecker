<script>
import palette from "google-palette";
import { isEmpty } from "./utils";

const CategoryPlugin = {
  install(Vue, { router }) {
    Vue.mixin({
      created: function() {
        // some logic ...
      }
    });

    Vue.prototype.$parseHtml = (content, bank) => {
      let bankParser = require("@/plugin/parser/" + bank + ".js");
      return bankParser.parse(content);
    };

    /**
     * TODO: Split historical and general so it can be used in all charts
     * @param {object} data output of the @see filter function in store.
     * Contains the historical sorting in as <tt>sorting</tt> and the actual data.
     * The data by itself contains the category (<tt>category</tt>), the sum of all entries (<tt>sum</tt>) and the historical entries (<tt>values</tt>).
     */
    Vue.prototype.$createChartData = (data, transparent) => {
      let chartData = {
        general: {
          datasets: [],
          labels: []
        },
        historical: {
          datasets: []
        }
      };

      // make list out of map
      let listData = Object.keys(data.data).map(key => {
        return {
          category: key,
          sum: data.data[key].sum,
          values: data.data[key].values
        };
      });

      listData.sort((e1, e2) => {
        return Math.abs(e1.sum) > Math.abs(e2.sum) ? -1 : 1;
      });

      let backgrounds = [];
      if (listData.length > 9) {
        backgrounds = palette("tol-dv", listData.length).map(hex => {
          return "#" + hex;
        });
      } else {
        backgrounds = palette("cb-Blues", listData.length).map(hex => {
          return "#" + hex;
        });
      }

      //general
      chartData.general.datasets.push({
        data: listData.map(el => {
          return Math.abs(el.sum);
        }),
        backgroundColor: backgrounds
      });
      chartData.general.labels = listData.map(el => {
        return el.category;
      });

      // historical data

      for (let index in listData) {
        chartData.historical.datasets.push({
          label: listData[index].category,
          data: data.sorting.map(key => {
            return Math.abs(listData[index].values[key]);
          }),
          borderColor: backgrounds[index],
          backgroundColor: transparent ? "rgba(0, 0, 0, 0)" : backgrounds[index]
        });
      }
      chartData.historical.labels = data.sorting;

      return chartData;
    };

    Vue.prototype.$createTableData = data => {
      let tableData = [];

      let keys = Object.keys(data.data);
      keys.sort((e1, e2) => {
        return Math.abs(data.data[e1].sum) > Math.abs(data.data[e2].sum)
          ? -1
          : 1;
      });
      keys.forEach(key => {
        tableData.push({
          category: key,
          sum: Math.abs(Math.round(data.data[key].sum * 100) / 100) + " €",
          count: data.data[key].entries.length,
          avg:
            Math.abs(
              Math.round(
                (data.data[key].sum * 100) / data.data[key].entries.length
              ) / 100
            ) + " €",
          std:
            getStandardDeviation(
              data.data[key].entries.map(elem => {
                return Math.abs(+elem.amount);
              }),
              2
            ) + " €"
        });
      });

      return tableData;
    };

    Vue.prototype.$std = array => {
      return getStandardDeviation(array, 2);
    };

    Vue.prototype.$isEmpty = obj => {
      return isEmpty(obj);
    };

    Vue.prototype.$scrollMeTo = refName => {
      var element = Vue.$refs[refName];
      var top = element.offsetTop;

      window.scrollTo(0, top);
    };

    Vue.prototype.$storeHasData = () => {
      return Vue.$store.getters.hasData;
    };

    Vue.prototype.$routeTo = route => {
      router.push(route);
    };
  }
};

export default CategoryPlugin;

function getNumWithSetDec(num, numOfDec) {
  var pow10s = Math.pow(10, numOfDec || 0);
  return numOfDec ? Math.round(pow10s * num) / pow10s : num;
}

function getAverageFromNumArr(numArr, numOfDec) {
  if (!Array.isArray(numArr)) {
    return false;
  }
  var i = numArr.length,
    sum = 0;
  while (i--) {
    sum += numArr[i];
  }
  return getNumWithSetDec(sum / numArr.length, numOfDec);
}

function getVariance(numArr, numOfDec) {
  if (!Array.isArray(numArr)) {
    return false;
  }
  var avg = getAverageFromNumArr(numArr, numOfDec),
    i = numArr.length,
    v = 0;

  while (i--) {
    v += Math.pow(numArr[i] - avg, 2);
  }
  v /= numArr.length;
  return getNumWithSetDec(v, numOfDec);
}

function getStandardDeviation(numArr, numOfDec) {
  if (!Array.isArray(numArr)) {
    return false;
  }
  var stdDev = Math.sqrt(getVariance(numArr, numOfDec));
  return getNumWithSetDec(stdDev, numOfDec);
}
</script>