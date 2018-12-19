const fs = require("fs");
const jsdom = require("jsdom");
const dataFile = "george.json";
const categoryFile = "categorizer.json";

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
  let categories = { out: { food: { supermarkt: [] } } };
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
    console.log("Month " + month);
    Object.keys(data[month]).forEach((day, index) => {
      console.log("\tDay " + day + ".");
      for (index in data[month][day]) {
        elem = data[month][day][index];
        console.log("\t\t" + elem.info);
        if (!categoryContainsValue(categories, elem.info)) {
          categories.out.food.supermarkt.push(elem.info);
          //console.log(JSON.stringify(categories));
        }
      }
    });
  });

  fs.writeFile(categoryFile, JSON.stringify(categories), () => {});
}

function categoryContainsValue(category, insertValue) {
  let returnValue = false;
  Object.keys(category).forEach(function(key, index) {
    const value = category[key];
    // console.log("Key " + key + "; Value " + value);
    if (value === insertValue) {
      console.log("value " + value + " already in category");
      returnValue = true;
      return;
    } else if (typeof value === "object") {
      returnValue = categoryContainsValue(value, insertValue);
      return;
    }
  });
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
