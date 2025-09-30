import "./layers.order.css.ts";

import "./fonts.css.ts"; // Pretendard @font-face
import "./theme.css.ts"; // --background / --foreground, 다크모드
import "./tokens.css.ts"; // createGlobalTheme로 --color-* 바인딩

import "./reset.css.ts";

import { globalStyle } from "@vanilla-extract/css";
import * as layers from "./layers.css";

// 제목 margin reset
globalStyle("h1, h2, h3, h4, h5, h6", {
  "@layer": { [layers.components]: { margin: 0 } },
});

// body 기본 폰트/배경/전경
globalStyle("body", {
  "@layer": {
    [layers.components]: {
      margin: 0,
      fontFamily: ["Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "Roboto", '"Helvetica Neue"', '"Segoe UI"', '"Apple SD Gothic Neo"', '"Noto Sans KR"', '"Malgun Gothic"', "sans-serif"].join(", "),
      backgroundColor: "var(--background)",
      color: "var(--foreground)",
    },
  },
});

// a, button 기본 커서
globalStyle("a, button", {
  "@layer": { [layers.components]: { cursor: "pointer" } },
});
