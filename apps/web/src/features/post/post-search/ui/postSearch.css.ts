/**
 * Post search component styles
 */

import { style } from "@vanilla-extract/css";

export const postSearchStyles = {
  container: style({
    display: "flex",
    width: "100%",
    maxWidth: "400px",
  }),
  inputWrapper: style({
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "320px",
  }),
  searchInput: style({
    flex: 1,
  }),
  clearButton: style({
    padding: "8px",
  }),
};
