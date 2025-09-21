import { style } from "@vanilla-extract/css";

export const postListItemStyles = {
  container: style({
    backgroundColor: "var(--color-white)",
    padding: "12px 10px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    transition: "background-color 0.18s ease, box-shadow 0.18s ease",
    ":hover": { background: "var(--color-gray-100)" },
    ":focus": {
      outline: "2px solid var(--color-brand-500)",
      outlineOffset: "2px",
    },
    selectors: {
      '&[data-checked="true"]': {
        backgroundColor: "var(--color-brand-50)", // ← 체크시 배경
      },
      '&[data-checked="true"]:hover': {
        backgroundColor: "var(--color-brand-100)", // ← 체크+호버
      },
      '&[data-checked="true"][data-active="true"]': {
        boxShadow: "inset 0 0 0 1px var(--color-brand-300)", // 선택+활성 강조
      },
    },
  }),
  checkView: style({
    width: 16,
    height: 16,
    marginRight: 18,
  }),
  contentView: style({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  }),
  bottomContentView: style({
    display: "flex",
    flexDirection: "row",
    gap: "6px",
    alignItems: "center",
    marginTop: "6px",
    fontSize: "12px",
    color: "var(--color-gray-500)",
  }),
  rightView: style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  }),
  date: style({
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "20px",
    color: "var(--color-gray-500)",
  }),
  title: style({
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "20px",
    margin: 0,
  }),
  boardName: style({
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "20px",
    color: "var(--color-gray-500)",
  }),
};
