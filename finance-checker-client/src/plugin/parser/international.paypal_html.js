import $ from "jquery";
import { convertMonthToString, prepareDataOnDate } from "@/plugin/utils";

export function parse(content) {
  let data = {};
  let html = $(content);
  html
    .find(".transactionList .transactionItem")
    .each((index, transactionItem) => {
      transactionItem = $(transactionItem);
      const month = convertMonthToString(
        getText(transactionItem.find(".dateParts > .dateMonth"))
      );
      const day = getText(transactionItem.find(".dateParts > .dateDay"));
      const year = getText(transactionItem.find(".dateParts > .accessAid"));

      prepareDataOnDate(year, month, day, data);

      let parsedDayEntry = parseDayEntry(transactionItem);
      if (parsedDayEntry) {
        data[year][month][day].push({
          year: year,
          month: month,
          day: day,
          ...parsedDayEntry
        });
      }
    });

  return data;
}

function parseDayEntry(dayEntry) {
  let data = {};

  data.info = getText(dayEntry.find(".transactionDescription")).toUpperCase();
  if (dayEntry.find(".netAmount").length > 0) {
    data.amount = +(
      "-" +
      getText(dayEntry.find(".netAmount"))
        .replace(",", ".")
        .replace("USD", "")
        .replace("EUR", "")
    );
  } else if (dayEntry.find(".isPositive").length > 0) {
    data.amount = getText($(dayEntry.find(".isPositive")[1]))
      .replace(",", ".")
      .replace("USD", "")
      .replace("EUR", "");
  }

  if (isNaN(data.amount) || +data.amount == 0) return false; // *** Abschlussbuchung per 30.09.2018 **** interessiert uns nicht
  return data;
}

function getText(elem) {
  return elem
    .text()
    .replace(/(\r\n\t|\n|\r\t|\.)/gm, "")
    .replace("USD", "")
    .trim();
}
