import { globalStyle, style } from "@vanilla-extract/css";

export const editorRoot = style({
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  overflow: "hidden",
  background: "#fff",
});

export const toolbar = style({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 12px",
  background: "#fafafa",
  borderBottom: "1px solid #eee",
  flexWrap: "wrap",
});

export const btn = style({
  padding: "4px",
  minWidth: "30px",
  borderRadius: 8,
  fontSize: 13,
  lineHeight: "20px",
  border: "1px solid transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  selectors: {
    "&:hover": { background: "#efefef" },
    "&[aria-pressed='true']": { background: "#e6f0ff", borderColor: "#cfe0ff" },
  },
});

export const divider = style({
  width: 1,
  height: 20,
  background: "#d4d4d4",
  margin: "0 6px",
});

export const selectRoot = style({});

globalStyle(`${selectRoot} [data-slot="trigger"]`, {
  height: 30,
  minWidth: "unset",
  borderRadius: 8,
  backgroundColor: "#fff",
});

export const selectIcon = style({
  position: "absolute",
  right: 8,
  pointerEvents: "none",
  display: "inline-flex",
  alignItems: "center",
});

export const option = style({
  fontSize: 13,
  color: "#111827",
  backgroundColor: "#ffffff",
});

export const editorSurface = style({
  padding: 16,
  position: "relative",
});

export const contentEditable = style({
  outline: "none",
  lineHeight: 1.7,
  fontSize: 15,
  resize: "none",
  minHeight: 360,
});

export const placeholder = style({
  color: "#9ca3af",
  position: "absolute",
  pointerEvents: "none",
  top: 20,
  left: 20,
});

export const colorBtn = style({
  height: 28,
  width: 28,
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  padding: 0,
  overflow: "hidden",
  selectors: { "&:hover": { boxShadow: "inset 0 0 0 2px #dbeafe" } },
});

export const colorSwatch = style({
  width: "100%",
  height: "100%",
  border: "none",
  padding: 0,
  appearance: "none",
  background: "transparent",
  cursor: "pointer",
});

/* Lexical theme mapping targets */
export const code = style({
  background: "#f7fafb",
  display: "block",
  borderRadius: 8,
  padding: "8px 8px 8px 52px",
  lineHeight: 1.6,
  fontSize: 14,
  margin: "8px 0",
  overflowX: "auto",
  position: "relative",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  selectors: {
    "&::before": {
      content: "attr(data-gutter)",
      color: "#999",
      position: "absolute",
      top: 0,
      left: 0,
      backgroundColor: "#d9dddf",
      padding: "8px",
      minWidth: "32px",
      height: "100%",
      textAlign: "right",
    },
  },
});

export const quote = style({
  borderLeft: "4px solid #dddddd",
  padding: "4px 16px",
  margin: "16px 0",
});

const listItemBase = style({
  listStyle: "none",
  position: "relative",
  marginLeft: "8px",
  paddingLeft: "24px",
  selectors: {
    "&:focus-visible": {
      boxShadow: "none",
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: "4px",
      left: "4px",
      display: "inline-block",
      width: "16px",
      height: "16px",
      border: "1px solid #c5c5c5",
      borderRadius: "2px",
    },
  },
});

export const list = {
  ul: style({ listStyle: "disc", marginLeft: 16, listStylePosition: "inside" }),
  ol: style({ listStyle: "decimal", marginLeft: 16, listStylePosition: "inside" }),
  listItem: style({ margin: "4px 32px" }),
  nestedListItem: style({ listStyle: "none" }),
  listItemChecked: style([
    listItemBase,
    {
      selectors: {
        "&::before": {
          backgroundColor: "#3b72e9",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: "8px",
          left: "7px",
          display: "inline-block",
          width: "10px",
          height: "5px",
          borderBottom: "2px solid white",
          borderLeft: "2px solid white",
          transform: "rotate(-40deg)",
        },
      },
    },
  ]),
  listItemUnchecked: style([listItemBase]),
};

export const heading = {
  h1: style({ fontSize: 32, fontWeight: 700 }),
  h2: style({ fontSize: 24, fontWeight: 700 }),
  h3: style({ fontSize: 18, fontWeight: 600 }),
};

export const text = {
  bold: style({ fontWeight: 600 }),
  italic: style({ fontStyle: "italic" }),
  underline: style({ textDecoration: "underline" }),
  strikethrough: style({ textDecoration: "line-through" }),
  underlineStrikethrough: style({
    textDecoration: "underline line-through",
  }),
  code: style({
    backgroundColor: "#e8eced",
    padding: "1px 0.25rem",
    fontFamily: "Menlo, Consolas, Monaco, monospace",
    fontSize: "94%",
  }),
  sub: style({ verticalAlign: "sub", fontSize: "0.8em" }),
  sup: style({ verticalAlign: "super", fontSize: "0.8em" }),
};

export const link = style({
  color: "#2563eb",
  textDecoration: "underline",
  textUnderlineOffset: 2,
});

export const token = {
  comment: style({
    color: "slategray",
  }),
  punctuation: style({
    color: "#999",
  }),
  property: style({
    color: "#905",
  }),
  selector: style({
    color: "#690",
  }),
  operator: style({
    color: "#9a6e3a",
  }),
  attr: style({
    color: "#07a",
  }),
  variable: style({
    color: "#e90",
  }),
  function: style({
    color: "#dd4a68",
  }),
};
