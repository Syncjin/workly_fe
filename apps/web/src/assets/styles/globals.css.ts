import "./layers.order.css.ts";

// Pretendard font is now loaded via Next.js font optimization in layout.tsx
import "./theme.css.ts"; // --background / --foreground, 다크모드
import "./tokens.css.ts"; // createGlobalTheme로 --color-* 바인딩

import "./reset.css.ts";

import { globalStyle } from "@vanilla-extract/css";
import * as layers from "./layers.css";

// 제목 margin reset
globalStyle("h1, h2, h3, h4, h5, h6", {
  "@layer": { [layers.components]: { margin: 0 } },
});

// html, body 기본 폰트 설정
globalStyle("html, body", {
  "@layer": {
    [layers.components]: {
      fontFamily: "var(--font-pretendard), system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    },
  },
});

// body 기본 스타일
globalStyle("body", {
  "@layer": {
    [layers.components]: {
      margin: 0,
      backgroundColor: "var(--background)",
      color: "var(--foreground)",
    },
  },
});

// a, button 기본 커서
globalStyle("a, button", {
  "@layer": { [layers.components]: { cursor: "pointer" } },
});
