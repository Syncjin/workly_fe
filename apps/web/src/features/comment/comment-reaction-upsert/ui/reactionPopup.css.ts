import { style } from "@vanilla-extract/css";

export const reactionPopup = style({
  minWidth: "auto",
  padding: 0,
  borderRadius: 12,
  backgroundColor: "#fff",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  position: "absolute",
  bottom: "calc(100% + 8px)",
  left: "50%",
  transform: "translateX(-10%)",
  zIndex: 1000,
  // 화살표 추가
  "::after": {
    content: '""',
    position: "absolute",
    top: "100%",
    left: "10%",
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "6px solid transparent",
    borderRight: "6px solid transparent",
    borderTop: "6px solid #fff",
  },
});

export const reactionPopupContent = style({
  padding: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
