<script>
import palette from "google-palette";

const CategoryPlugin = {
  install(Vue, options) {
    Vue.mixin({
      data: () => {
        return {
          categories: options.categories
        };
      }
    });

    Vue.prototype.$filterByCategory = category => {
      var categoryList = {};
      let returnValue = [];

      actOnCategory(
        category,
        (key, subCategory) => {
          //subcategory function
          categoryList[key] = flatten(subCategory);
        },
        () => {
          //category function
          returnValue = Object.keys(category).map(elem => {
            return { category: elem, value: 0 };
          });
        },
        () => {
          //leaf function
          categoryList["all"] = category;
          returnValue = [{ category: "all", value: 0 }];
        }
      );

      const data = options.data;

      forEachElem(data, elem => {
        for (let cat in categoryList) {
          // check all categories
          if (categoryList[cat].includes(elem.info)) {
            returnValue.filter(el => {
              return cat === el.category;
            })[0].value += Math.abs(+elem.amount);
          }
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

    Vue.prototype.$getInCategory = () => {
      return renderCategory("in", options.categories.in);
    };

    Vue.prototype.$getOutCategory = () => {
      return renderCategory("out", options.categories.out);
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

      data.sort((e1, e2) => {
        return Math.abs(e1.value) > Math.abs(e2.value) ? -1 : 1;
      });

      chartData.datasets.push({
        data: data.map(el => {
          return Math.abs(el.value);
        }),
        backgroundColor: palette("tol-dv", data.length).map(hex => {
          return "#" + hex;
        })
      });
      chartData.labels.push(
        ...data.map(el => {
          return el.category;
        })
      );
      return chartData;
    };
  }
};

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

function strStartsWith(string, list) {
  for (let elem in list) {
    if (string.startsWith(list[elem])) {
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