const fs = require("fs");
const jsdom = require("jsdom");
const dataFile = "george.json";

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
    const month = monthView.find("thead h2").text();

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
});

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
    fs.writeFile(dataFile, JSON.stringify(data));
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
