const fs = require("fs");
const jsdom = require("jsdom");
const inquirer = require("inquirer");
const deasync = require("deasync");
const dataFile = "data.json";
const categoryFile = "categorizer.json";
let inquirerLock = false;

fs.readFile("./George.html", function(err, html) {
  if (err) {
    throw err;
  }
  const { JSDOM } = jsdom;
  const dom = new JSDOM(html);
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
        console.log(parsedDayEntry);
        if (parsedDayEntry) {
          data[month][day].push(parsedDayEntry);
        }
      });
    }
  });
  writeBack(data);
  console.log(JSON.stringify(data, null, 2));
  buildCategoryFile(data);
});

function buildCategoryFile(data) {
  let categories = { in: [], out: [] };
  if (fs.existsSync(categoryFile)) {
    fs.readFile(categoryFile, "utf8", (err, catData) => {
      if (err) {
        console.log(err);
      } else {
        console.log(catData);
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
    // console.log("Month " + month);
    Object.keys(data[month]).forEach((day, index) => {
      // console.log("\tDay " + day + ".");
      for (index in data[month][day]) {
        while (inquirerLock) {
          deasync.sleep(100);
        }
        elem = data[month][day][index];
        // console.log("\t\t" + elem.info);
        if (+elem.amount > 0) {
          getCategory(true, categories.in, elem).then(category => {
            categories.in = category;
          });
        } else {
          getCategory(false, categories.out, elem).then(category => {
            categories.out = category;
          });
        }
        console.log(JSON.stringify(categories));
      }
    });
  });

  fs.writeFile(categoryFile, JSON.stringify(categories), () => {});
}

async function getCategory(inFlow, categories, elem) {
  if (inFlow) {
    console.log("Incoming category " + elem.info);
  } else {
    console.log("Outgoing category " + elem.info);
  }
  if (!categoryContainsValue(categories, elem.info)) {
    answer = await inquireCategory(categories, elem);
    return answer;
  } else {
    return categories;
  }
}

async function inquireCategory(categories, elem) {
  const placeHere = "place here";
  const newCategory = "new category";
  inquirerLock = true;
  let choices = [];
  if (categories) {
    if (Array.isArray(categories)) {
      choices = [placeHere];
      if (categories.length === 0) {
        choices.push(newCategory);
      }
    } else {
      let keys = Object.keys(categories);
      console.log(JSON.stringify(categories));
      choices = [...keys, new inquirer.Separator(), newCategory];
    }

    let answers = await inquirer.prompt([
      {
        type: "list",
        name: "selection",
        message: "What do you want to do?",
        choices
      }
    ]);

    if (answers.selection === placeHere) {
      categories.push(elem.info);
    } else {
      if (answers.selection === newCategory) {
        let newCat = await inquirer.prompt([
          {
            type: "input",
            name: "new",
            message: "What is the name of the category"
          }
        ]);
        categories = {};
        categories[newCat.new] = []; // TODO can't set object in a list
        console.log(
          "after answer " +
            newCat.new +
            " category is " +
            JSON.stringify(categories)
        );
        answers.selection = newCat.new;
      }
      categories[answers.selection] = await inquireCategory(
        categories[answers.selection],
        elem
      );
    }
  }
  inquirerLock = false;
  return categories;
}

function categoryContainsValue(category, insertValue) {
  let returnValue = false;
  if (category) {
    Object.keys(category).forEach(function(key, index) {
      const value = category[key];
      // console.log("Key " + key + "; Value " + value);
      if (value === insertValue) {
        console.log("value " + value + " already in category");
        returnValue = true;
        return;
      } else if (typeof value === "object") {
        if (categoryContainsValue(value, insertValue)) {
          returnValue = true;
          return;
        }
      }
    });
  }
  return returnValue;
}

function writeBack(data) {
  if (fs.existsSync(dataFile)) {
    //@see https://stackoverflow.com/questions/36856232/write-add-data-in-json-file-using-node-js
    fs.readFile(dataFile, "utf8", function readFileCallback(err, previousData) {
      if (err) {
        console.log(err);
      } else {
        obj = JSON.parse(previousData); //now it an object
        obj = { ...obj, ...data };
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile(dataFile, json, "utf8"); // write it back
      }
    });
  } else {
    fs.writeFile(dataFile, JSON.stringify(data), "utf8");
  }
}

function parseDayEntry(dayEntry) {
  let data = {};

  data.info = getText(dayEntry.find(".accountcol h5"));
  data.amount = getText(dayEntry.find(".amountcol .balance")).replace(",", ".");

  if (isNaN(data.amount) || +data.amount == 0) return false; // *** Abschlussbuchung per 30.09.2018 **** interessiert uns nicht
  return data;
}

function getText(elem) {
  return elem
    .text()
    .replace(/(\r\n\t|\n|\r\t)/gm, "")
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
