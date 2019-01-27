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
  if (!Array.isArray(data)) {
    Object.keys(data).forEach(month => {
      if (!Array.isArray(data[month])) {
        Object.keys(data[month]).forEach(day => {
          data[month][day].forEach(elem => {
            callback(month, day, elem);
          });
        });
      } else {
        // TODO: wtf should that happen?
        data[month].forEach(elem => {
          callback(month, undefined, elem);
        });
      }
    });
  } else {
    // TODO: wtf should that happen?
    data.forEach(elem => {
      callback(undefined, undefined, elem);
    });
  }
}

// Input format MMMMyyyy (i.e September2008)
export function getMonthAsString(dateString) {
  return dateString.substring(0, dateString.length - 4);
}

// Input format MMMMyyyy (i.e September2008)
export function getMonthAsNr(dateString) {
  return moment.months().indexOf(getMonthAsString(dateString)) + 1;
}

// Input format MMMMyyyy (i.e September2008)
export function getYear(dateString) {
  return dateString.substring(dateString.length - 4, dateString.length);
}

export function findEarliestLatestDate(data) {
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

export function addToCategory(
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
    const newPath = path + "." + key;
    returnValue.push({
      id: newPath,
      label: key,
      children: renderCategory(newPath, subCategory)
    });
  });
  return returnValue;
}

export function getHistoricalValue(date, month, day, elem) {
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

export function getDataByDate(date, fullData) {
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

export function getCategoryTree(startingpoint, categories) {
  return renderCategory(startingpoint, categories[startingpoint]);
}
