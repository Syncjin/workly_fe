import { createVar, style } from "@vanilla-extract/css";

export const colorVar = createVar();

const checker = {
  backgroundImage: "linear-gradient(45deg, #ccc 25%, transparent 25%)," + "linear-gradient(-45deg, #ccc 25%, transparent 25%)," + "linear-gradient(45deg, transparent 75%, #ccc 75%)," + "linear-gradient(-45deg, transparent 75%, #ccc 75%)",
  backgroundSize: "8px 8px",
  backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
};

export const btn = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "4px",
  borderRadius: 8,
  border: "1px solid transparent",
  cursor: "pointer",
  fontSize: 13,
  lineHeight: "20px",
  selectors: {
    "&:hover": { background: "#efefef" },
    "&[aria-pressed='true']": { background: "#e6f0ff", borderColor: "#cfe0ff" },
  },
});

export const mini = style({ width: 14, height: 14, borderRadius: 4, border: "1px solid var(--color-gray-200)", position: "relative", overflow: "hidden", ...checker });

export const miniFill = style({ position: "absolute", inset: 0, backgroundColor: colorVar });

export const header = style({
  fontSize: 16,
  fontWeight: 500,
  color: "var(--color-gray-900)",
  lineHeight: "24px",
});

export const resetBtn = style({ display: "flex", gap: 8, alignItems: "center", padding: "8px 12px", cursor: "pointer", fontSize: 16, fontWeight: 500, color: "var(--color-gray-900)", lineHeight: "24px" });

export const noneBox = style({
  width: 18,
  height: 18,
  borderRadius: 4,
  position: "relative",
  overflow: "hidden",
  ...checker,
  selectors: { "&::after": { content: '""', position: "absolute", inset: -2, background: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,0,0,0.25) 4px, rgba(255,0,0,0.25) 8px)", borderRadius: 6 } },
});

export const section = style({ padding: "8px 12px 4px", fontSize: 11, color: "var(--color-gray-600)" });
export const row = style({ display: "flex", flexWrap: "wrap", gap: 8, padding: "6px 12px 8px" });
export const grid = style({ display: "grid", gridTemplateColumns: "repeat(9, 24px)", gap: 8, padding: "8px 12px 12px" });
export const palette = style({
  width: 24,
  height: 24,
  borderRadius: 6,
  border: "1px solid var(--color-gray-200)",
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
  ...checker,
  selectors: { "&:hover": { outline: "2px solid rgba(0,0,0,0.08)" }, "&:focus-visible": { outline: "2px solid rgba(59,130,246,0.4)" } },
});

export const rgbRow = style({ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px 12px" });

export const fill = style({ position: "absolute", inset: 0, backgroundColor: colorVar });

export const hexInput = style({ flex: 1, height: 32, borderRadius: 8, border: "1px solid var(--color-gray-300)", padding: "0 10px", fontSize: 12, outline: "none" });
export const preview = style({ width: 28, height: 28, borderRadius: 6, border: "1px solid var(--color-gray-200)", position: "relative", overflow: "hidden", ...checker });
export const previewFill = style({ position: "absolute", inset: 0, backgroundColor: colorVar });

export const applyBtn = style({ height: 32, padding: "0 10px", borderRadius: 8, border: "1px solid var(--color-gray-200)", background: "#fff", cursor: "pointer" });

export const trigger = {
  btn,
  mini,
  miniFill,
} as const;

export const menu = {
  header,
  resetBtn,
  noneBox,
  section,
  row,
  grid,
  palette,
  rgbRow,
  fill,
  hexInput,
  preview,
  previewFill,
  applyBtn,
} as const;
