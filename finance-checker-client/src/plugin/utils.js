export const moment = require("moment");

// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;

export function isEmpty(obj) {
  //@see https://stackoverflow.com/questions/4994201/is-object-empty

  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== "object") return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

export function flatten(category) {
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

export function forEachElem(data, callback) {
  Object.keys(data).forEach(year => {
    Object.keys(data[year]).forEach(month => {
      Object.keys(data[year][month]).forEach(day => {
        data[year][month][day].forEach(elem => {
          callback(year, month, day, elem);
        });
      });
    });
  });
}

/**
 * Returns the months as number
 * @param {string} dateString Input format MMMMyyyy (i.e September2008)
 */
export function getMonthAsString(dateString) {
  return dateString.substring(0, dateString.length - 4);
}

/**
 * Returns the months as string
 * @param {string} dateString Input format MMMMyyyy (i.e September2008)
 */
export function getMonthAsNr(dateString) {
  return monthToNr(getMonthAsString(dateString));
}

export function monthToNr(month) {
  return moment.months().indexOf(month) + 1;
}

/**
 * Returns the years as string
 * @param {string} dateString Input format MMMMyyyy (i.e September2008)
 */
export function getYear(dateString) {
  return dateString.substring(dateString.length - 4, dateString.length);
}

export function findEarliestLatestDate(data) {
  let lowestDate = moment("9999-12-31", "YYYY-MM-DD").toDate();
  let highestDate = moment("0000-01-01", "YYYY-MM-DD").toDate();
  forEachElem(data, (year, month, day) => {
    const date = moment(year + "-" + month + "-" + day, "YYYY-MM-DD").toDate();
    if (date.getTime() < lowestDate.getTime()) {
      lowestDate = date;
    }
    if (date.getTime() > highestDate.getTime()) {
      highestDate = date;
    }
  });
  return [lowestDate, highestDate];
}

/**
 * Data might have holes (for example, on day 15 no incoming entry was found). For the graphical display these holes have to be filled up.
 * i.e. with 0 or NaN. In this case 0 was choosen.
 */
export function fillUpHistoricalData(
  returnValue,
  date,
  dataStartDate,
  dataEndDate
) {
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

export function addToCategory(returnValue, category, dateSelection, elem) {
  const sum = +elem.amount;
  if (!returnValue[category])
    returnValue[category] = {
      sum: 0,
      values: {}, //historical values
      entries: []
    };
  returnValue[category].sum += sum;
  const histValue = getHistoricalValue(dateSelection, elem);
  if (!returnValue[category].values[histValue.key])
    returnValue[category].values[histValue.key] = 0;
  returnValue[category].values[histValue.key] += histValue.value;
  returnValue[category].entries.push(elem);
  return returnValue;
}

/**
 *  There are two states of categories. First is when the category is a leaf. Second is when the category contians subcategories.
 *
 * @param {object} category Category-tree
 * @param {function} subCategoryFunction Callback: When underling structure are subcategories
 * @param {function} categoryFunction Callback: What shoud happen to current category
 * @param {function} leafFunction Callback: If current category is an array then it's a leave category.
 */
export function actOnCategory(
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

export function strStartsWith(str, list) {
  for (let elem in list) {
    if (str.startsWith(list[elem])) {
      return true;
    }
  }
  return false;
}

export function resolveCategory(parts, data) {
  if (parts.length > 0) {
    let smallerParts = parts.slice(1);
    return resolveCategory(smallerParts, data[parts[0]]);
  } else {
    return data;
  }
}

export function renderCategory(path, cat) {
  let returnValue = [];

  actOnCategory(cat, (key, subCategory) => {
    const prefix = isEmpty(path) ? path : path + ".";
    const newPath = prefix + key;
    returnValue.push({
      id: newPath,
      label: key,
      children: renderCategory(newPath, subCategory)
    });
  });
  return returnValue;
}

export function getHistoricalValue(date, elem) {
  let historicalValue = { key: undefined, value: +elem.amount };

  if (date) {
    if (!isNaN(+date)) {
      historicalValue.key = elem.month;
    } else {
      historicalValue.key = elem.day;
    }
  } else {
    historicalValue.key = elem.year;
  }
  return historicalValue;
}

export function getDataByDate(date, fullData) {
  let data = fullData;

  if (date) {
    if (date.length === 4) {
      data = {};
      Object.keys(fullData).forEach(year => {
        if (year === date) {
          data[year] = fullData[year];
        }
      });
    } else if (date.length > 4) {
      data = {};
      Object.keys(fullData).forEach(year => {
        Object.keys(fullData[year]).forEach(month => {
          if (month + year === date) {
            if (data[year]) data[year] = {};
            data[year][month] = fullData[year][month];
          }
        });
      });
    }
  }
  return data;
}

export function getDateList(date, dataStartDate, dataEndDate) {
  let datesList = [];

  if (date) {
    if (date.length === 4) {
      datesList = moment.months();
    } else if (date.length > 4) {
      const year = getYear(date);
      const month = getMonthAsNr(date);
      const monthlenght = new Date(+year, month, 0).getDate();
      for (let i = 1; i <= monthlenght; i++) {
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

/**
 * Joins together all arrays of this object
 * @param {*} obj Object with array at its leaves
 * @returns flattend array (all leaves joined together)
 */
export function join(obj) {
  if (Array.isArray(obj)) {
    return obj;
  } else if (typeof obj === "object") {
    let array = [];
    Object.keys(obj).forEach(key => {
      array.push(...join(obj[key]));
    });
    return array;
  }
  return [];
}

export function getCategoryPath(path, findValue, categories) {
  let returnValue = false;
  if (Array.isArray(categories) && categories.includes(findValue)) {
    return path;
  } else if (typeof categories === "object") {
    Object.keys(categories).forEach(function(key) {
      const value = categories[key];
      let newValue = getCategoryPath(path + "." + key, findValue, value);
      if (newValue) returnValue = newValue;
    });
  }
  return returnValue;
}

export function addRedundantData(data) {
  let returnValue = {};
  forEachElem(data, (year, month, day, elem) => {
    let replacedMonth = replaceMonthName(month);

    if (!returnValue[year]) returnValue[year] = {};

    if (!returnValue[year][replacedMonth])
      returnValue[year][replacedMonth] = {};

    if (!returnValue[year][replacedMonth][day])
      returnValue[year][replacedMonth][day] = [];

    returnValue[year][replacedMonth][day].push({
      year: year,
      month: replacedMonth,
      day: day,
      ...elem
    });
  });
  return returnValue;
}

export function removeRedundantData(data) {
  let returnValue = { categories: data.categories, data: {} };
  forEachElem(data.data, (year, month, day, elem) => {
    let copyElem = clone(elem);
    delete copyElem.year;
    delete copyElem.month;
    delete copyElem.day;
    delete copyElem.date;

    if (!returnValue.data[year]) returnValue.data[year] = {};

    if (!returnValue.data[year][month]) returnValue.data[year][month] = {};

    if (!returnValue.data[year][month][day])
      returnValue.data[year][month][day] = [];

    returnValue.data[year][month][day].push(copyElem);
  });
  return returnValue;
}

export function download(categories, data) {
  let downloadData = { categories: categories, data: data };
  return (
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(removeRedundantData(downloadData)))
  );
}

export function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

// TODO: sort this after plain utils(clone, isEmpty, ...), category function, data functions, graphic function

const replacements = [
  { repl: "January", find: ["Jänner", "jänner", "january", "januar"] },
  { repl: "February", find: ["Februar"] },
  { repl: "March", find: ["März"] },
  { repl: "April", find: ["april"] },
  { repl: "May", find: ["Mai"] },
  { repl: "June", find: ["Juni"] },
  { repl: "July", find: ["Juli"] },
  { repl: "August", find: ["august"] },
  { repl: "September", find: ["september"] },
  { repl: "October", find: ["Oktober"] },
  { repl: "November", find: ["november"] },
  { repl: "December", find: ["Dezember"] }
];
export function replaceMonthName(month) {
  let returnValue = month;
  replacements.forEach(repPair => {
    repPair.find.forEach(find => {
      if (month === find) {
        returnValue = repPair.repl;
        return;
      }
    });
    if (returnValue !== month) {
      return;
    }
  });
  return returnValue;
}

export function firstPartOfCategory(str) {
  const parts = str === "" ? [] : str.split(".");
  return parts.length > 0 ? parts[0] : "";
}

/**
 * Elements can be assigend to multiple categories if the rootcategory (i.e "in", "out", "save", "...") are different.
 *
 * @param {*} elem element that should be checked
 * @param {string} categoryPath categorypath in which the element should be assigned
 */
export function isValidCat(elem, categoryPath) {
  if (!elem.category) {
    const rootCategory = firstPartOfCategory(categoryPath);
    if (["in", "out"].includes(rootCategory)) {
      if (rootCategory === "in" && +elem.amount < 0) {
        return false;
      } else if (rootCategory === "out" && +elem.amount > 0) {
        return false;
      }
    }
    return true;
  }
}

export function isEqualEntry(entry, compareEntry) {
  if (
    entry.year === compareEntry.year &&
    entry.month === compareEntry.month &&
    entry.day === compareEntry.day &&
    entry.info === compareEntry.info &&
    entry.amount === compareEntry.amount
  ) {
    return true;
  }
  return false;
}
