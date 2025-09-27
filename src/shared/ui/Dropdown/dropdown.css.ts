import { style } from "@vanilla-extract/css";

export const dropdownContainer = style({ position: "relative", display: "inline-block" });

export const triggerBase = style({ cursor: "pointer", display: "inline-flex", alignItems: "center" });

export const dropdownMenu = style({
  position: "absolute",
  top: "100%",
  left: 0,
  marginTop: "8px",
  background: "#fff",
  border: "1px solid var(--color-gray-200)",
  borderRadius: "8px",
  boxShadow: "0 12px 16px -4px rgba(10,13,18,0.08), 0 4px 6px -2px rgba(10,13,18,0.03)",
  minWidth: "240px",
  zIndex: 1000,
});

export const dropdownItem = style({
  display: "flex",
  alignItems: "center",
  padding: "10px 16px",
  cursor: "pointer",
  transition: "background 0.2s ease",
  selectors: { "&:hover": { background: "#f5f5f5" } },
});

export const iconStyle = style({ marginRight: "12px", display: "flex", alignItems: "center", justifyContent: "center" });

export const headerStyle = style({ padding: "12px 16px", fontWeight: 600, fontSize: "14px", color: "var(--color-gray-700)" });

export const lineStyle = style({ height: "1px", background: "var(--color-gray-200)" });
