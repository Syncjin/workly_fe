/**
 * Post filters component styles
 */

import { style } from "@vanilla-extract/css";

export const postFiltersStyles = {
  container: style({
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  }),

  filtersRow: style({
    display: "flex",
    alignItems: "flex-end",
    gap: "16px",
    flexWrap: "wrap",
  }),

  filterGroup: style({
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minWidth: "160px",
  }),

  filterLabel: style({
    fontSize: "14px",
    fontWeight: 500,
    color: "#374151",
  }),

  clearButton: style({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    whiteSpace: "nowrap",
  }),
};
