import { style } from "@vanilla-extract/css";

export const postListWidgetStyles = {
  container: style({
    width: "100%",
    display: "flex",
    flexDirection: "column",
  }),

  controls: style({
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "24px",
    width: "100%",

    "@media": {
      "(max-width: 768px)": {
        gap: "12px",
        marginBottom: "16px",
      },
    },
  }),

  searchControl: style({
    width: "100%",
    maxWidth: "400px",

    "@media": {
      "(max-width: 768px)": {
        maxWidth: "100%",
      },
    },
  }),

  filtersControl: style({
    width: "100%",
  }),

  listView: style({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: "8px",
  }),
};
