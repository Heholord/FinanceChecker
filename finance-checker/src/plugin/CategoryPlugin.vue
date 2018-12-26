<script>
import palette from "google-palette";

const CategoryPlugin = {
  install(Vue, options) {
    Vue.mixin({
      data: () => {
        return {};
      }
    });

    // special categories preprocessing (adding to categories-object)
    forEachElem(options.data, elem => {
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

    Vue.prototype.$filterByCategory = (categoryPath, date) => {
      var categoryList = {};
      let returnValue = [];

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
          returnValue.all = { value: 0, entries: [] };
        }
      );

      const data = getData(date, options.data);

      forEachElem(data, elem => {
        if (!elem.category) {
          // for normal categories
          for (let cat in categoryList) {
            if (categoryList[cat].includes(elem.info)) {
              if (!returnValue[cat])
                returnValue[cat] = { value: 0, entries: [] };
              returnValue[cat].value += Math.abs(+elem.amount);
              returnValue[cat].entries.push(elem);
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
          if (!returnValue[displayCategory])
            returnValue[displayCategory] = { value: 0, entries: [] };
          returnValue[displayCategory].value += Math.abs(+elem.amount);
          returnValue[displayCategory].entries.push(elem);
        }
      });

      return returnValue;
    };

    Vue.prototype.$subcategories = category => {
      let returnValue = [];
      actOnCategory(category, (key, subCategory) => {
        returnValue.push({
          key: key,
          data: subCategory
        });
      });
      return returnValue;
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

    Vue.prototype.$createChartData = data => {
      let chartData = { datasets: [], labels: [] };

      let listData = [];
      Object.keys(data).forEach(key => {
        listData.push({ category: key, value: data[key].value });
      });

      listData.sort((e1, e2) => {
        return Math.abs(e1.value) > Math.abs(e2.value) ? -1 : 1;
      });

      chartData.datasets.push({
        data: listData.map(el => {
          return Math.abs(el.value);
        }),
        backgroundColor: palette("tol-dv", listData.length).map(hex => {
          return "#" + hex;
        })
      });
      chartData.labels.push(
        ...listData.map(el => {
          return el.category;
        })
      );
      return chartData;
    };
  }
};

function getData(date, fullData) {
  let data = fullData;

  if (date) {
    if (date.length === 4) {
      data = {};
      Object.keys(fullData).forEach(key => {
        const year = key.substring(key.length - 4, key.length);
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
  Object.keys(data).forEach(month => {
    Object.keys(data[month]).forEach(day => {
      for (let index in data[month][day]) {
        //retrieve all days
        const elem = data[month][day][index];
        callback(elem);
      }
    });
  });
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