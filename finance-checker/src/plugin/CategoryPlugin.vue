<script>
import palette from "google-palette";
const moment = require("moment");

const CategoryPlugin = {
  install(Vue, options) {
    Vue.mixin({
      data: () => {
        return {};
      }
    });

    const startEndDates = findEarliestLatestDate(options.data);

    const dataStartDate =
      getYear(startEndDates[0]) + "-" + getMonthAsNr(startEndDates[0]) + "-01";
    const dataEndDate =
      getYear(startEndDates[1]) + "-" + getMonthAsNr(startEndDates[1]) + "-28";

    // special categories preprocessing (adding to categories-object)
    forEachElem(options.data, (month, day, elem) => {
      if (elem.category) {
        const strParts = elem.category.split(".");
        let lastCat = options.categories;
        for (let index in strParts) {
          const part = strParts[index];
          if (!lastCat[part]) {
            if (index == strParts.length - 1) {
              lastCat[part] = [];
            } else {
              lastCat[part] = {};
            }
          }
          lastCat = lastCat[part];
        }
      }
    });

    Vue.prototype.$getDisabledDates = date => {
      return (
        date.getTime() < moment(dataStartDate) ||
        date.getTime() > moment(dataEndDate)
      );
    };

    Vue.prototype.$getCategoryTree = startingpoint => {
      return renderCategory(startingpoint, options.categories[startingpoint]);
    };

    Vue.prototype.$findCategory = path => {
      let parts = [];
      if (strStartsWith(path, ["in", "out", "save"])) {
        parts = path.split(".");
      }
      return resolveCategory(parts, options.categories);
    };

    /**
     *
     * @param {string} categoryPath the path of the category where the subcategories should be optained. If there is no subcategory then a subcategory "all" will be returned.
     * @param {string} date the date can be "undefined", a year (i.e 2010) or a month (MMMMYYYY, i.e. February2000)
     * @returns {object} creates an object with following structure:
     * - sorting {array}: list with the sorted keys of the historical data (i.e [2000, 2001, ..., 2020], [Jannuar, Feb...., December], [01, 02, ..., 31])
     * - data {object}: Object with the subcategories of the given categoryPath as keys. Each entry of the data consists of three values:
     *  - category {string}: name of the category
     *  - value {integer}: sum of all entries in this category by a given date
     *  - values {object}: historical data (all date entries are classified into historical data).
     *            So the historical key is dependent on the given date format. If date is "undefined" then the years are the keys. If the given date is a year (i.e 2010) then the months are the keys and if the year is of format (MMMMYYYY, i.e. February2000) then the keys are the days of this month.
     *            the value is the sum of all entries in this historical category.
     */
    Vue.prototype.$filterByCategory = (categoryPath, date) => {
      var categoryList = {};
      let returnValue = {};

      const category = Vue.prototype.$findCategory(categoryPath);
      let rootCategory = categoryPath !== "" ? categoryPath.split(".")[0] : "";

      // create flat category structure
      actOnCategory(
        category,
        (key, subCategory) => {
          //subcategory function
          categoryList[key] = flatten(subCategory);
        },
        () => {}, //category function
        () => {
          //leaf function
          categoryList["all"] = category;
          returnValue.all = { value: 0, values: {}, entries: [] }; //cummulative values, historical values, entities with info
        }
      );

      const data = getDataByDate(date, options.data);

      forEachElem(data, (month, day, elem) => {
        elem.date = moment(month + day, "MMMMYYYYD").format("YYYY-MM-DD");
        if (!elem.category) {
          // for normal categories
          for (let cat in categoryList) {
            if (rootCategory === "") rootCategory = cat; // in cases where cat is in, out, save
            if (
              categoryList[cat].includes(elem.info) && // check if element is part of the category
              (rootCategory === "save" || // and element is part of the right category tree  in this case (for example mom can be incoming and outgoing)
                (rootCategory === "in" && +elem.amount > 0) ||
                (rootCategory === "out" && +elem.amount < 0))
            ) {
              returnValue = addToCategory(
                returnValue,
                cat,
                date,
                month,
                day,
                elem
              );
            }
            if (rootCategory === cat) rootCategory = ""; // revert special rootCategory magic
          }
        } else if (elem.category && elem.category.startsWith(categoryPath)) {
          // for special categories
          let str = elem.category.replace(categoryPath, "");
          if (str.startsWith(".")) {
            str = str.replace(".", "");
          }
          const strParts = str === "" ? [] : str.split(".");
          let displayCategory = "all";
          if (strParts.length > 0) {
            displayCategory = strParts[0];
          }
          returnValue = addToCategory(
            returnValue,
            displayCategory,
            date,
            month,
            day,
            elem
          );
        }
      });

      returnValue = fillUpHistoricalData(
        returnValue,
        date,
        dataStartDate,
        dataEndDate
      );

      return returnValue;
    };

    Vue.prototype.$createChartData = data => {
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
          backgroundColor: backgrounds[index] // "rgba(0, 0, 0, 0.05)"
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

    Vue.prototype.$dateList = date => {
      return getDateList(date, dataStartDate, dataEndDate);
    };
  }
};

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

function findEarliestLatestDate(data) {
  let lowestDate = "December2999";
  let highestDate = "January0000";
  Object.keys(data).forEach(key => {
    let year = getYear(key);
    let month = getMonthAsNr(key);
    if (getYear(lowestDate) > year) {
      lowestDate = key;
    } else if (getYear(lowestDate) == year) {
      if (getMonthAsNr(lowestDate) > month) {
        lowestDate = key;
      }
    }

    if (getYear(highestDate) < year) {
      highestDate = key;
    } else if (getYear(highestDate) == year) {
      if (getMonthAsNr(highestDate) < month) {
        highestDate = key;
      }
    }
  });

  return [lowestDate, highestDate];
}

/**
 * Data might have holes (for example, on day 15 no incoming entry was found). For the graphical display these holes have to be filled up.
 * i.e. with 0 or NaN. In this case 0 was choosen.
 */
function fillUpHistoricalData(returnValue, date, dataStartDate, dataEndDate) {
  const dateList = getDateList(date, dataStartDate, dataEndDate);

  Object.keys(returnValue).forEach(elemKey => {
    let elem = returnValue[elemKey];
    dateList.forEach(dateElem => {
      if (!Object.keys(elem.values).includes(dateElem)) {
        elem.values[dateElem] = 0;
      }
    });
    returnValue[elemKey] = elem;
  });

  return { sorting: dateList, data: returnValue };
}

function getDateList(date, dataStartDate, dataEndDate) {
  let datesList = [];

  if (date) {
    if (date.length === 4) {
      datesList = moment.months();
    } else if (date.length > 4) {
      const year = getYear(date);
      const month = getMonthAsNr(date);
      const monthlenght = new Date(+year, month, 0).getDate();
      for (let i = 1; i < monthlenght; i++) {
        datesList.push("" + i);
      }
    }
  } else {
    let startYear = moment(dataStartDate).year();
    let endYear = moment(dataEndDate).year();
    for (; startYear <= endYear; startYear++) {
      datesList.push("" + startYear);
    }
  }
  return datesList;
}

function addToCategory(
  returnValue,
  category,
  dateSelection,
  elemMonth,
  elemDay,
  elem
) {
  const value = +elem.amount;
  if (!returnValue[category])
    returnValue[category] = {
      value: 0,
      values: {}, //historical values
      entries: []
    };
  returnValue[category].value += value;
  const histValue = getHistoricalValue(dateSelection, elemMonth, elemDay, elem);
  if (!returnValue[category].values[histValue.key])
    returnValue[category].values[histValue.key] = 0;
  returnValue[category].values[histValue.key] += histValue.value;
  returnValue[category].entries.push(elem);
  return returnValue;
}

function getHistoricalValue(date, month, day, elem) {
  let historicalValue = { key: undefined, value: +elem.amount };

  if (date) {
    if (date.length === 4) {
      historicalValue.key = getMonthAsString(month);
    } else if (date.length > 4) {
      historicalValue.key = day;
    }
  } else {
    historicalValue.key = getYear(month);
  }
  return historicalValue;
}

function getDataByDate(date, fullData) {
  let data = fullData;

  if (date) {
    if (date.length === 4) {
      data = {};
      Object.keys(fullData).forEach(key => {
        const year = getYear(key);
        if (year === date) {
          data[key] = fullData[key];
        }
      });
    } else if (date.length > 4) {
      data = {};
      Object.keys(fullData).forEach(key => {
        if (key === date) {
          data[key] = fullData[key];
        }
      });
    }
  }
  return data;
}

// Input format MMMMyyyy (i.e September2008)
function getMonthAsString(dateString) {
  return dateString.substring(0, dateString.length - 4);
}

// Input format MMMMyyyy (i.e September2008)
function getMonthAsNr(dateString) {
  return moment.months().indexOf(getMonthAsString(dateString)) + 1;
}

// Input format MMMMyyyy (i.e September2008)
function getYear(dateString) {
  return dateString.substring(dateString.length - 4, dateString.length);
}

function actOnCategory(
  category,
  subCategoryFunction,
  categoryFunction,
  leafFunction
) {
  if (Array.isArray(category)) {
    if (leafFunction) leafFunction();
  } else if (typeof category === "object") {
    Object.keys(category).forEach(catKey => {
      if (subCategoryFunction) subCategoryFunction(catKey, category[catKey]);
    });
    if (categoryFunction) categoryFunction();
  }
}

function strStartsWith(str, list) {
  for (let elem in list) {
    if (str.startsWith(list[elem])) {
      return true;
    }
  }
  return false;
}

function resolveCategory(parts, data) {
  if (parts.length > 0) {
    let smallerParts = parts.slice(1);
    return resolveCategory(smallerParts, data[parts[0]]);
  } else {
    return data;
  }
}

function renderCategory(path, cat) {
  let returnValue = [];

  actOnCategory(cat, (key, subCategory) => {
    const newPath = path + "." + key;
    returnValue.push({
      id: newPath,
      label: key,
      children: renderCategory(newPath, subCategory)
    });
  });
  return returnValue;
}

function forEachElem(data, callback) {
  if (!Array.isArray(data)) {
    Object.keys(data).forEach(month => {
      if (!Array.isArray(data[month])) {
        Object.keys(data[month]).forEach(day => {
          data[month][day].forEach(elem => {
            callback(month, day, elem);
          });
        });
      } else {
        data[month].forEach(elem => {
          callback(month, undefined, elem);
        });
      }
    });
  } else {
    data.forEach(elem => {
      callback(undefined, undefined, elem);
    });
  }
}

function flatten(category) {
  let returnValue = [];
  actOnCategory(
    category,
    (key, subCategory) => {
      //subcategory function
      returnValue.push(...flatten(subCategory));
    },
    () => {}, //category function
    () => {
      // leaf function
      returnValue = category;
    }
  );
  return returnValue;
}

export default CategoryPlugin;
</script>