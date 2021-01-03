import { prepareDataOnDate, moment, isEmpty } from "../utils"

export function parse(content) {
  let data = {}
  let jsonData = JSON.parse(content)

  jsonData.forEach((elem) => {
    let year, month, day
    let date = moment(elem.booking)
    year = date.year()
    month = date.format("MMMM")
    day = date.date()
    let parsedDayEntry = parseDayEntry(elem)
    if (parsedDayEntry) {
      prepareDataOnDate(year, month, day, data)
      data[year][month][day].push({
        year: year,
        month: month,
        day: day,
        ...parsedDayEntry,
      })
    }
  })

  return data
}

function parseDayEntry(dayEntry) {
  let data = {}

  if (!isEmpty(dayEntry.partnerName)) {
    data.info = dayEntry.partnerName
  } else {
    data.info = dayEntry.reference
  }
  data.info = data.info.toUpperCase

  data.amount = dayEntry.amount.value / Math.pow(10, dayEntry.amount.precision)

  if (isNaN(data.amount) || +data.amount == 0) return false // *** Abschlussbuchung per 30.09.2018 **** interessiert uns nicht
  return data
}
