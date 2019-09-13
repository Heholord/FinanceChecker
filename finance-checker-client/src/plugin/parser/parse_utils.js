/** @param elem JQuery Element */
export function getText(elem) {
  return elem
    .text()
    .replace(/(\r\n\t|\n|\r\t|\.)/gm, "")
    .replace("EUR", "")
    .replace("USD", "")
    .trim();
}
