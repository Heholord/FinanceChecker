<script>
const CategoryPlugin = {
  install(Vue, options) {
    // 3. inject some component options
    Vue.mixin({
      data: () => {
        return {
          categories: options.categories
        };
      }
    });

    // 4. add an instance method
    Vue.prototype.$filterByCategories = categoryItems => {
      const data = options.data;
      // const categories = options.categories;
      let returnValue = Object.keys(categoryItems).map(elem => {
        return { category: elem, value: 0 };
      });
      forEachElem(data, elem => {
        for (let category in categoryItems) {
          // check all categories
          if (categoryItems[category].includes(elem.info)) {
            returnValue.filter(elem => {
              return category === elem.category;
            })[0].value += Math.abs(+elem.amount);
          }
        }
      });
      return returnValue;
    };

    Vue.prototype.$filterByCategory = category => {
      var categoryList = {};
      let returnValue = [];
      if (!Array.isArray(category)) {
        Object.keys(category).forEach(key => {
          categoryList[key] = flatten(category[key]);
        });
        returnValue = Object.keys(category).map(elem => {
          return { category: elem, value: 0 };
        });
      } else {
        categoryList["all"] = category;
        returnValue = [{ category: "all", value: 0 }];
      }

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
      if (typeof category === "object") {
        Object.keys(category).forEach(subCategory => {
          if (typeof category[subCategory] === "object") {
            returnValue.push({
              key: subCategory,
              data: category[subCategory]
            });
          }
        });
      }

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
  }
};

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
  if (typeof cat === "object") {
    Object.keys(cat).forEach(catKey => {
      if (typeof cat[catKey] === "object") {
        const newPath = path + "." + catKey;
        returnValue.push({
          id: newPath,
          label: catKey,
          children: renderCategory(newPath, cat[catKey])
        });
      }
    });
    return returnValue;
  }
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
  if (Array.isArray(category)) {
    return category;
  } else {
    Object.keys(category).forEach(key => {
      returnValue.push(...flatten(category[key]));
    });
  }
  return returnValue;
}

export default CategoryPlugin;
</script>