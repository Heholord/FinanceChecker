import $ from "jquery";
import { getYear, getMonthAsString } from "@/plugin/utils";

export function parse(content) {
  let data = {};
  let html = $(content);
  html.find(".transactionlist").each((index, monthView) => {
    monthView = $(monthView);
    const yearMonth = monthView
      .find("thead h2")
      .text()
      .trim()
      .replace(/\s/gm, "");

    if (yearMonth) {
      const year = getYear(yearMonth);
      const month = getMonthAsString(yearMonth);
      if (!data[year]) data[year] = {};
      if (!data[year][month]) data[year][month] = {};
      monthView.find("tbody .transaction-line").each((index, dayEntry) => {
        dayEntry = $(dayEntry);
        let parsedDayEntry = parseDayEntry(dayEntry);
        if (parsedDayEntry) {
          let day = dayEntry.find(".datecol .day").text();
          if (!data[year][month][day]) data[year][month][day] = [];
          data[year][month][day].push({
            year: year,
            month: month,
            day: day,
            ...parsedDayEntry
          });
        }
      });
    }
  });

  return data;
}

function parseDayEntry(dayEntry) {
  let data = {};

  dayEntry = $(dayEntry);

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
