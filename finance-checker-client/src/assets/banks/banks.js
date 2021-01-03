export default {
  austria: {
    label: "Austria",
    children: {
      george: {
        label: "George",
        image: "banks/george.svg",
        children: {
          json: {
            label: "JSON",
            image: "banks/json.svg",
          },
          html: {
            label: "HTML",
            image: "banks/html.svg",
          },
        },
      },
      raiffeisen: {
        label: "Raiffeisen",
        children: {},
      },
    },
  },
  international: {
    label: "International",
    children: {
      paypal: {
        label: "Paypal",
        image: "banks/paypal.svg",
        children: {
          html: {
            label: "HTML",
            // image: "html.svg"
          },
        },
      },
      westernunion: {
        label: "Western Union",
        children: {},
      },
    },
  },
}
