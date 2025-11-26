/**
 * Post search component styles
 */

import { style } from "@vanilla-extract/css";

export const postSearchStyles = {
  container: style({
    display: "flex",
    width: "100%",
    maxWidth: "220px",
    "@media": {
      "screen and (max-width: 1024px)": {
        maxWidth: "200px",
      },
      "screen and (max-width: 768px)": {
        maxWidth: "none",
      },
    },
  }),
  inputWrapper: style({
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "220px",
    "@media": {
      "screen and (max-width: 1024px)": {
        width: "200px",
      },
      "screen and (max-width: 768px)": {
        width: "100%",
      },
    },
  }),
  searchInput: style({
    flex: 1,
  }),
  clearButton: style({
    padding: "8px",
  }),
};
