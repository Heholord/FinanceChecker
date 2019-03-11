import Vue from "vue";
import Vuex from "vuex";
import {
  moment,
  forEachElem,
  getMonthAsNr,
  getYear,
  findEarliestLatestDate,
  fillUpHistoricalData,
  addToCategory,
  actOnCategory,
  strStartsWith,
  resolveCategory,
  getDataByDate,
  flatten,
  getDateList,
  isEmpty,
  addRedundantData,
  clone,
  firstPartOfCategory,
  isValidCat
} from "./utils";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

const store = new Vuex.Store({
  state: {
    categories: {},
    data: {},
    dataStartDate: "0000-01-01",
    dataEndDate: "9999-12-31"
  },
  strict: debug,
  getters: {
    categories: state => state.categories,
    data: state => state.data,
    disabledDates: state => date => {
      return (
        date.getTime() < moment(state.dataStartDate) ||
        date.getTime() > moment(state.dataEndDate)
      );
    },
    findCategory: state => path => {
      let parts = [];
      if (strStartsWith(path, ["in", "out", "save"])) {
        parts = path.split(".");
      }
      return resolveCategory(parts, state.categories);
    },
    /**
     * TODO: rename function to filter
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
    filter: (state, getters) => (categoryPath, date) => {
      var categoryList = {};
      let returnValue = {};

      const category = getters.findCategory(categoryPath);

      // create flat category structure of all subcategories (if category is a leaf then create an all-subcategory)
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

      const data = getDataByDate(date, state.data);

      forEachElem(data, (month, day, elem) => {
        let workElem = clone(elem);
        workElem.date = moment(month + day, "MMMMYYYYD").format("YYYY-MM-DD");
        // for normal categories
        const cat = getCorrespondingCategory(
          workElem,
          categoryPath,
          categoryList
        );
        if (cat) {
          returnValue = addToCategory(returnValue, cat, date, workElem);
        }
      });

      returnValue = fillUpHistoricalData(
        returnValue,
        date,
        state.dataStartDate,
        state.dataEndDate
      );

      return returnValue;
    },
    dateList: state => date => {
      return getDateList(date, state.dataStartDate, state.dataEndDate);
    }
  },
  mutations: {
    setCategories(state, categories) {
      state.categories = categories;
    },
    setData(state, data) {
      state.data = data;
    },
    setDataStartDate(state, dataStartDate) {
      state.dataStartDate = dataStartDate;
    },
    setDataEndDate(state, dataEndDate) {
      state.dataEndDate = dataEndDate;
    },
    /**
     * Edit entry. If oldEntry and newEntry are given, then an update is initiated.
     * If only oldEntry is given then the corresponding entry will be deleted.
     * If only a newEntry is given then the entry will be added to the store.
     * @param {object} param
     * - oldEntry
     * - newEntry
     */
    updateEntriy(state, { oldEntry, newEntry }) {
      if (oldEntry) {
        if (newEntry) {
          // update
          updateElem(
            state.data[oldEntry.month][oldEntry.day],
            state.data,
            oldEntry,
            newEntry
          );
        } else {
          // delete
          deleteElem(state.data[oldEntry.month][oldEntry.day], oldEntry);
        }
      } else if (newEntry) {
        //insert
        insertElem(state.data, newEntry);
      }
    },
    buildCategory(state, categoryPath) {
      const parts = categoryPath.split(".");
      let categories = state.categories;
      for (let idx in parts) {
        const part = parts[idx];
        if (categories[part]) {
          if (Array.isArray(categories[part])) {
            if (isEmpty(categories[part])) {
              categories[part] = {};
            } else {
              categories[part] = { other: categories[part] };
            }
          }
        } else {
          if (idx == parts.length - 1) {
            categories[part] = [];
          } else {
            categories[part] = {};
          }
        }
        categories = categories[part];
      }
    },
    addToCategory(state, { elem, categoryPath }) {
      const parts = categoryPath.split("."); //todo substitute with common method (check resolveCategory function)
      let categories = state.categories;
      for (let idx in parts) {
        const part = parts[idx];
        if (categories[part]) {
          if (Array.isArray(categories[part])) {
            categories[part].push(elem.info);
          }
          categories = categories[part];
        }
      }
    }
  },
  actions: {
    setData({ commit }, data) {
      let categories = data.categories;
      commit("setData", addRedundantData(data.data));

      const startEndDates = findEarliestLatestDate(data.data);

      commit(
        "setDataStartDate",
        getYear(startEndDates[0]) + "-" + getMonthAsNr(startEndDates[0]) + "-01"
      );
      commit(
        "setDataEndDate",
        moment(
          new Date(
            +getYear(startEndDates[1]),
            getMonthAsNr(startEndDates[1]),
            0
          )
        ).format("YYYY-MM-DD")
      );
      // special categories preprocessing (adding to categories-object) if not existent
      forEachElem(data.data, (month, day, elem) => {
        if (elem.category) {
          const strParts = elem.category.split(".");
          let lastCat = categories;
          for (let index in strParts) {
            const part = strParts[index];
            if (!lastCat[part]) {
              // if category does not exist yet
              if (index == strParts.length - 1) {
                //if it is the last category
                lastCat[part] = [];
              } else {
                //if there are subcategories waiting
                lastCat[part] = {};
              }
            }
            lastCat = lastCat[part]; // go deeper
          }
        }
      });
      commit("setCategories", categories);
      return new Promise(resolve => {
        resolve();
      });
    }
  }
});

/**
 * Given a category tree and an element, this function returns the category to which the element belongs to.
 * If the element has a special category configured then the root of this category will be returned
 * TODO: Document further and correctly
 * @param {*} elem
 * @param {*} categoryPath
 * @param {*} categoryList
 */
function getCorrespondingCategory(elem, categoryPath, categoryList) {
  if (elem.category && elem.category.startsWith(categoryPath)) {
    let str = elem.category.replace(categoryPath, "");
    str = cleanStringHead(str);
    const firstPart = firstPartOfCategory(str);
    return isEmpty(firstPart) ? "all" : firstPart; //if it is leave category (i.e there are no subcategories), make a new subcat
  } else {
    for (let cat in categoryList) {
      const subcatPath = isEmpty(categoryPath) ? cat : categoryPath + "." + cat;
      if (
        categoryList[cat].includes(elem.info) &&
        isValidCat(elem, subcatPath)
      ) {
        // check if element is part of the category
        return cat;
      }
    }
  }
  return false;
}

function cleanStringHead(str) {
  if (str.startsWith(".")) {
    return str.replace(".", "").trim();
  }
  return str;
}

function updateElem(list, data, oldValue, newValue) {
  if (oldValue.month === newValue.month && oldValue.day === newValue.day) {
    list.splice(list.indexOf(oldValue), 1, newValue);
  } else {
    deleteElem(list, oldValue);
    insertElem(data, newValue);
  }
}

function deleteElem(list, oldValue) {
  list.splice(list.indexOf(oldValue), 1);
}

function insertElem(data, newValue) {
  if (!data[newValue.month]) data[newValue.month] = {};
  if (!data[newValue.month][newValue.day])
    data[newValue.month][newValue.day] = [];
  data[newValue.month][newValue.day].push(newValue);
}

export default store;
