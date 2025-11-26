import { style } from "@vanilla-extract/css";

export const headerText = style({
  display: "block",
  padding: "0 12px 0 32px",
  fontSize: "14px",
  fontWeight: 700,
  color: "var(--color-gray-900)",
  lineHeight: "32px",
  textAlign: "left",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

//     padding-top: 15px;
// }
// .ct_layer h4 {
//     font-size: 18px;
//     line-height: 22px;
//     color: #202124;
//     word-break: break-all;
//     word-wrap: break-word;

export const title = style({
  display: "block",
  padding: "15px 24px 0 24px",
  fontSize: "18px",
  fontWeight: 700,
  color: "var(--color-gray-900)",
  lineHeight: "32px",
  textAlign: "left",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  wordBreak: "break-all",
  wordWrap: "break-word",
});

export const content = style({
  display: "block",
  padding: "8px 24px 12px 24px",
  fontSize: "14px",
  fontWeight: 500,
  color: "var(--color-gray-500)",
  lineHeight: "20px",
  textAlign: "left",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  wordBreak: "break-all",
  wordWrap: "break-word",
});

export const popup = style({
  width: "400px",
});

export const loading = style({
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  padding: 50,
});
