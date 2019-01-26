<script>
import palette from "google-palette";
import $ from "jquery";
import { isEmpty } from "./utils";

const CategoryPlugin = {
  install(Vue) {
    Vue.prototype.$parseHtml = content => {
      return parseHTMLString(content);
    };

    /**
     * @param {object} data output of the @see $filterByCategory function.
     * Contains the historical sorting in as <tt>sorting</tt> and the actual data.
     * The data by itself contains the category (<tt>category</tt>), the sum of all entries (<tt>value</tt>) and the historical entries (<tt>values</tt>).
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

      let listData = Object.keys(data.data).map(key => {
        return {
          category: key,
          value: data.data[key].value,
          values: data.data[key].values
        };
      });

      listData.sort((e1, e2) => {
        return Math.abs(e1.value) > Math.abs(e2.value) ? -1 : 1;
      });

      //general
      chartData.general.datasets.push({
        data: listData.map(el => {
          return Math.abs(el.value);
        }),
        backgroundColor: palette("tol-dv", listData.length).map(hex => {
          return "#" + hex;
        })
      });
      chartData.general.labels = listData.map(el => {
        return el.category;
      });

      // historical data
      const backgrounds = palette("tol-dv", listData.length).map(hex => {
        return "#" + hex;
      });

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
        return Math.abs(data.data[e1].value) > Math.abs(data.data[e2].value)
          ? -1
          : 1;
      });
      keys.forEach(key => {
        tableData.push({
          category: key,
          sum: Math.abs(Math.round(data.data[key].value * 100) / 100) + " €",
          count: data.data[key].entries.length,
          avg:
            Math.abs(
              Math.round(
                (data.data[key].value * 100) / data.data[key].entries.length
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
  }
};

function parseHTMLString(content) {
  let data = {};

  let html = $(content);

  html.find(".transactionlist").each((index, monthView) => {
    monthView = $(monthView);
    const month = monthView
      .find("thead h2")
      .text()
      .trim()
      .replace(/\s/gm, "");

    if (month) {
      data[month] = {};
      monthView.find("tbody .transaction-line").each((index, dayEntry) => {
        dayEntry = $(dayEntry);
        let day = dayEntry.find(".datecol .day").text();
        if (!data[month][day]) data[month][day] = [];
        let parsedDayEntry = parseDayEntry(dayEntry);
        if (parsedDayEntry) {
          data[month][day].push({ month: month, day: day, ...parsedDayEntry });
        }
      });
    }
  });

  return data;
}

function parseDayEntry(dayEntry) {
  let data = {};

  data.info = getText(dayEntry.find(".accountcol h5")).toUpperCase();
  data.amount = getText(dayEntry.find(".amountcol .balance")).replace(",", ".");

  if (isNaN(data.amount) || +data.amount == 0) return false; // *** Abschlussbuchung per 30.09.2018 **** interessiert uns nicht
  return data;
}

function getText(elem) {
  return elem
    .text()
    .replace(/(\r\n\t|\n|\r\t|\.)/gm, "")
    .trim();
}

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

export default CategoryPlugin;
</script>