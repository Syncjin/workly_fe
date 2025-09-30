/**
 * Post actions component styles
 */

import { style } from "@vanilla-extract/css";

export const postActionsStyles = {
  container: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  }),

  primaryActions: style({
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }),

  actionButton: style({
    padding: "8px",
    minWidth: "auto",

    ":hover": {
      backgroundColor: "#f3f4f6",
    },
  }),

  moreButton: style({
    padding: "8px",
    minWidth: "auto",
    color: "#6b7280",

    ":hover": {
      backgroundColor: "#f3f4f6",
      color: "#374151",
    },
  }),

  deleteAction: style({
    color: "#dc2626",

    ":hover": {
      backgroundColor: "#fef2f2",
      color: "#b91c1c",
    },
  }),
};
