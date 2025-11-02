import { style } from "@vanilla-extract/css";

export const container = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

export const header = style({
  fontWeight: 600,
  fontSize: "20px",
  lineHeight: "30px",
  color: "#000",
});

export const headerContainer = style({
  backgroundColor: "var(--color-white)",
});

export const headerTitle = style({
  fontSize: "20px",
  fontWeight: "600",
  margin: 0,
  color: "var(--color-gray-900)",
});

export const headerDescription = style({
  fontSize: "14px",
  color: "var(--color-gray-600)",
  marginTop: "4px",
});

export const toolbar = {
  container: style({
    marginTop: 24,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    "@media": {
      "screen and (max-width: 1024px)": {
        gap: 10,
      },
      "screen and (max-width: 768px)": {
        flexDirection: "column",
        alignItems: "stretch",
        gap: 12,
      },
    },
  }),
  leftArea: style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    minWidth: 0,
    flex: 1,
    "@media": {
      "screen and (max-width: 1024px)": {
        gap: 8,
      },
      "screen and (max-width: 768px)": {
        gap: 8,
        justifyContent: "flex-start",
        width: "100%",
        flex: "none",
      },
    },
  }),
  rightArea: style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
    "@media": {
      "screen and (max-width: 1024px)": {
        gap: 8,
      },
      "screen and (max-width: 768px)": {
        width: "100%",
        justifyContent: "space-between",
        gap: 8,
      },
      "screen and (max-width: 480px)": {
        flexDirection: "column",
        gap: 8,
        alignItems: "stretch",
      },
    },
  }),
};

export const listView = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  marginTop: 24,
  borderTopWidth: "1px",
  borderTopColor: "var(--color-gray-300)",
  borderTopStyle: "solid",
});

export const emptyState = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "400px",
  textAlign: "center",
  color: "var(--color-gray-600)",
});

export const emptyStateIcon = style({
  marginBottom: "24px",
  color: "var(--color-gray-400)",
});

export const emptyStateTitle = style({
  fontSize: "18px",
  fontWeight: 500,
  color: "var(--color-gray-600)",
  margin: 0,
  marginBottom: "8px",
});

export const emptyStateDescription = style({
  fontSize: "14px",
  color: "var(--color-gray-400)",
  margin: 0,
});

export const errorState = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "64px 16px",
  textAlign: "center",
  color: "var(--color-red-600)",
});

export const emptyTitle = style({
  fontSize: "18px",
  fontWeight: "600",
  color: "var(--color-gray-700)",
  margin: "16px 0 8px",
});
