const fs = require("fs");
const jsdom = require("jsdom");
const inquirer = require("inquirer");
const deasync = require("deasync");
const dataFile = "data.json";
const categoryFile = "categorizer.json";
const stringSimilarity = require("string-similarity");

let inquirerLock = false;

const on = true;
if (on) {
  fs.readFile("./George.html", function(err, html) {
    if (err) {
      throw err;
    }
    data = parseHTMLString(html);
    data = writeBack(data);
    buildCategoryFile(data);
  });
}

function parseHTMLString(content) {
  const { JSDOM } = jsdom;
  const dom = new JSDOM(content);
  const $ = require("jquery")(dom.window);
  let data = {};

  $(".transactionlist").each((index, monthView) => {
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
          data[month][day].push(parsedDayEntry);
        }
      });
    }
  });
  return data;
}

function buildCategoryFile(data) {
  let categories = { in: [], out: [] };
  if (fs.existsSync(categoryFile)) {
    fs.readFile(categoryFile, "utf8", (err, catData) => {
      if (err) {
        console.log(err);
      } else {
        categories = JSON.parse(catData);
        categorizeData(categories, data);
      }
    });
  } else {
    categorizeData(categories, data);
  }
}

function categorizeData(categories, data) {
  Object.keys(data).forEach((month, index) => {
    Object.keys(data[month]).forEach((day, index) => {
      for (index in data[month][day]) {
        while (inquirerLock) {
          deasync.sleep(100);
        }
        elem = data[month][day][index];

        if (elem.category) {
          console.log(elem.info + " is an exception");
        } else {
          let param = false;
          let cat = {};
          let updateCategory;
          if (+elem.amount > 0) {
            param = true;
            cat = categories.in;
            updateCategory = category => {
              categories.in = category;
            };
          } else {
            param = false;
            cat = categories.out;
            updateCategory = category => {
              categories.out = category;
            };
          }
          getCategory(param, cat, month, day, elem).then(category => {
            updateCategory(category);
            fs.writeFile(categoryFile, JSON.stringify(categories), () => {});
          });
        }
      }
    });
  });
}

async function getCategory(inFlow, categories, month, day, elem) {
  let rootCat = inFlow ? "in" : "out";
  let categoryText = "";
  if (inFlow) {
    categoryText =
      " (+) Incoming entry " +
      elem.info +
      " (" +
      elem.amount +
      "€) found on " +
      month +
      " " +
      day +
      "\n";
  } else {
    categoryText =
      " (-) Outgoing entry " +
      elem.info +
      " (" +
      elem.amount +
      "€) found on " +
      month +
      " " +
      day +
      "\n";
  }

  elem.info = elem.info.toUpperCase();
  const listCategories = flatten(categories);

  if (listCategories.includes(elem.info)) {
    // already categorized
    return categories;
  } else if (listCategories.length > 0) {
    // maybe there is a similar category
    console.log("");
    const bestMatch = stringSimilarity.findBestMatch(elem.info, listCategories)
      .bestMatch;
    if (bestMatch.rating > 0.5) {
      const categoryPath = getCategoryPath(
        rootCat,
        bestMatch.target,
        categories
      );

      const shouldUse = await inquirePreCategory(
        categoryText,
        bestMatch,
        categoryPath
      );
      categoryText = "";
      if (shouldUse) {
        return addToCategory(
          categoryPath.split(".").slice(1),
          categories,
          elem.info
        );
      }
    }
  }
  answer = await inquireCategory(categoryText, "", categories, elem); // nothing worked, okay let's extend the category tree
  return answer;
}

function addToCategory(categoryPath, category, info) {
  let returnValue = category;
  if (categoryPath.length > 0) {
    let smallerParts = categoryPath.slice(1);
    returnValue[categoryPath[0]] = addToCategory(
      smallerParts,
      returnValue[categoryPath[0]],
      info
    );
    return returnValue;
  } else {
    returnValue.push(info);
    return returnValue;
  }
}

async function inquirePreCategory(categoryText, bestMatch, categoryPath) {
  inquirerLock = true;

  let answers = await inquirer.prompt([
    {
      type: "confirm",
      name: "selection",
      message:
        categoryText +
        "Similar entry " +
        bestMatch.target +
        " (" +
        Math.round(bestMatch.rating * 100) +
        "% similarity) found. Sould the new entry be placed in path: " +
        categoryPath.split(".").join(" / ")
    }
  ]);

  inquirerLock = false;
  return answers.selection;
}

async function inquireCategory(categoryText, path, categories, elem) {
  const placeHere = "place here";
  const newCategory = "new category";
  const goBack = "go back";
  const skip = "skip";

  inquirerLock = true;
  returnValue = false;

  let choices = prepareChoises(
    path,
    placeHere,
    newCategory,
    skip,
    goBack,
    categories
  );

  while (!returnValue) {
    let answers = await inquirer.prompt([
      {
        type: "list",
        name: "selection",
        message:
          categoryText +
          (isEmpty(path) ? "Where do you want to place it? " : path + " / ..."),
        choices
      }
    ]);
    categoryText = "";

    if (answers.selection === goBack) {
      return false;
    } else if (answers.selection === skip) {
      returnValue = true;
    } else if (answers.selection === placeHere) {
      categories.push(elem.info);
      returnValue = true;
    } else {
      if (answers.selection === newCategory) {
        let newCat = await inquirer.prompt([
          {
            type: "input",
            name: "new",
            message: "What is the name of the category" //TODO validate
          }
        ]);
        if (Array.isArray(categories)) {
          if (categories.length > 0) {
            const temp = categories;
            categories = { other: temp };
          } else {
            categories = {};
          }
        }
        categories[newCat.new] = [];
        answers.selection = newCat.new;
      }
      returnValue = await inquireCategory(
        "",
        (isEmpty(path) ? "" : path + " / ") + answers.selection,
        categories[answers.selection],
        elem
      );
      if (typeof returnValue === "object") {
        categories[answers.selection] = returnValue;
      }
    }
  }
  inquirerLock = false;
  return categories;
}

function prepareChoises(
  path,
  placeHere,
  newCategory,
  skip,
  goBack,
  categories
) {
  let choices = [];
  if (Array.isArray(categories)) {
    choices = [placeHere, newCategory, skip];
    if (!isEmpty(path)) {
      choices.push(goBack);
    }
  } else {
    let keys = Object.keys(categories);
    choices = [...keys, new inquirer.Separator(), newCategory, skip];
    if (!isEmpty(path)) {
      choices.push(goBack);
    }
    choices.push(new inquirer.Separator());
  }
  return choices;
}

function getCategoryPath(path, findValue, categories) {
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

function writeBack(data) {
  if (fs.existsSync(dataFile)) {
    //append
    //@see https://stackoverflow.com/questions/36856232/write-add-data-in-json-file-using-node-js
    previousData = fs.readFileSync(dataFile, "utf8");
    obj = JSON.parse(previousData); //now it an object
    if (obj) obj = { ...data, ...obj };
    json = JSON.stringify(obj); //convert it back to json
    fs.writeFile(dataFile, json, "utf8", () => {}); // write it back
    return obj;
  } else {
    //overwrite
    fs.writeFile(dataFile, JSON.stringify(data), "utf8", () => {});
    return data;
  }
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

// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {
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
