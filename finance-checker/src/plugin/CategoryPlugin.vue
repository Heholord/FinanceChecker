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
    // console.log(moment.weekdays()[moment(dataStartDate).weekday()]);
    // console.log(moment.weekdays()[moment(dataEndDate).weekday()]);

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

    Vue.prototype.$filterByCategory = (categoryPath, date) => {
      var categoryList = {};
      let returnValue = {};

      const category = Vue.prototype.$findCategory(categoryPath);

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
        if (!elem.category) {
          // for normal categories
          for (let cat in categoryList) {
            if (categoryList[cat].includes(elem.info)) {
              returnValue = addToCategory(
                returnValue,
                cat,
                date,
                month,
                day,
                elem
              );
            }
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

      const sortList = data.sorting;

      for (let index in listData) {
        let sortedKey = Object.keys(listData[index].values);
        sortedKey.sort((a, b) => {
          return sortList.indexOf(a) > sortList.indexOf(b) ? 1 : -1;
        });
        chartData.historical.datasets.push({
          label: listData[index].category,
          data: sortedKey.map(key => {
            return listData[index].values[key];
          }),
          borderColor: backgrounds[index],
          backgroundColor: "rgba(0, 0, 0, 0.05)" // backgrounds[index]
        });
      }
      chartData.historical.labels = data.sorting;

      return chartData;
    };
  }
};

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

function fillUpHistoricalData(returnValue, date, dataStartDate, dataEndDate) {
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

  Object.keys(returnValue).forEach(elemKey => {
    let elem = returnValue[elemKey];
    datesList.forEach(dateElem => {
      if (!Object.keys(elem.values).includes(dateElem)) {
        elem.values[dateElem] = 0;
      }
    });
    returnValue[elemKey] = elem;
  });

  return { sorting: datesList, data: returnValue };
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
  returnValue[category].value += Math.abs(value);
  const histValue = getHistoricalValue(dateSelection, elemMonth, elemDay, elem);
  if (!returnValue[category].values[histValue.key])
    returnValue[category].values[histValue.key] = 0;
  returnValue[category].values[histValue.key] += histValue.value;
  returnValue[category].entries.push(elem);
  return returnValue;
}

function getHistoricalValue(date, month, day, elem) {
  let historicalValue = { key: undefined, value: Math.abs(+elem.amount) };

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