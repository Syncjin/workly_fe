import { style } from "@vanilla-extract/css";

// 반응형 스타일 헬퍼 함수들
export const responsive = {
  // 반응형 패딩
  padding: (mobile: string, tablet?: string, desktop?: string) =>
    style({
      padding: mobile,
      ...(tablet && {
        "@media": {
          "(min-width: 768px)": { padding: tablet },
        },
      }),
      ...(desktop && {
        "@media": {
          "(min-width: 1024px)": { padding: desktop },
        },
      }),
    }),

  // 반응형 마진
  margin: (mobile: string, tablet?: string, desktop?: string) =>
    style({
      margin: mobile,
      ...(tablet && {
        "@media": {
          "(min-width: 768px)": { margin: tablet },
        },
      }),
      ...(desktop && {
        "@media": {
          "(min-width: 1024px)": { margin: desktop },
        },
      }),
    }),

  // 반응형 폰트 크기
  fontSize: (mobile: string, tablet?: string, desktop?: string) =>
    style({
      fontSize: mobile,
      ...(tablet && {
        "@media": {
          "(min-width: 768px)": { fontSize: tablet },
        },
      }),
      ...(desktop && {
        "@media": {
          "(min-width: 1024px)": { fontSize: desktop },
        },
      }),
    }),

  // 반응형 너비
  width: (mobile: string, tablet?: string, desktop?: string) =>
    style({
      width: mobile,
      ...(tablet && {
        "@media": {
          "(min-width: 768px)": { width: tablet },
        },
      }),
      ...(desktop && {
        "@media": {
          "(min-width: 1024px)": { width: desktop },
        },
      }),
    }),

  // 반응형 높이
  height: (mobile: string, tablet?: string, desktop?: string) =>
    style({
      height: mobile,
      ...(tablet && {
        "@media": {
          "(min-width: 768px)": { height: tablet },
        },
      }),
      ...(desktop && {
        "@media": {
          "(min-width: 1024px)": { height: desktop },
        },
      }),
    }),

  // 반응형 디스플레이
  display: (mobile: string, tablet?: string, desktop?: string) =>
    style({
      display: mobile,
      ...(tablet && {
        "@media": {
          "(min-width: 768px)": { display: tablet },
        },
      }),
      ...(desktop && {
        "@media": {
          "(min-width: 1024px)": { display: desktop },
        },
      }),
    }),

  // 반응형 플렉스 방향
  flexDirection: (mobile: "row" | "column" | "row-reverse" | "column-reverse", tablet?: "row" | "column" | "row-reverse" | "column-reverse", desktop?: "row" | "column" | "row-reverse" | "column-reverse") =>
    style({
      flexDirection: mobile,
      ...(tablet && {
        "@media": {
          "(min-width: 768px)": { flexDirection: tablet },
        },
      }),
      ...(desktop && {
        "@media": {
          "(min-width: 1024px)": { flexDirection: desktop },
        },
      }),
    }),

  // 반응형 그리드 컬럼
  gridTemplateColumns: (mobile: string, tablet?: string, desktop?: string) =>
    style({
      gridTemplateColumns: mobile,
      ...(tablet && {
        "@media": {
          "(min-width: 768px)": { gridTemplateColumns: tablet },
        },
      }),
      ...(desktop && {
        "@media": {
          "(min-width: 1024px)": { gridTemplateColumns: desktop },
        },
      }),
    }),
};

// 반응형 컨테이너 스타일
export const container = style({
  width: "100%",
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: "16px",
  paddingRight: "16px",
  "@media": {
    "(min-width: 640px)": {
      maxWidth: "640px",
      paddingLeft: "24px",
      paddingRight: "24px",
    },
    "(min-width: 768px)": {
      maxWidth: "768px",
    },
    "(min-width: 1024px)": {
      maxWidth: "1024px",
      paddingLeft: "32px",
      paddingRight: "32px",
    },
    "(min-width: 1280px)": {
      maxWidth: "1280px",
    },
    "(min-width: 1536px)": {
      maxWidth: "1536px",
    },
  },
});

// 반응형 그리드 시스템
export const grid = {
  cols1: style({ gridTemplateColumns: "repeat(1, minmax(0, 1fr))" }),
  cols2: style({
    gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
    "@media": {
      "(min-width: 768px)": { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
    },
  }),
  cols3: style({
    gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
    "@media": {
      "(min-width: 768px)": { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
      "(min-width: 1024px)": { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" },
    },
  }),
  cols4: style({
    gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
    "@media": {
      "(min-width: 768px)": { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
      "(min-width: 1024px)": { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" },
    },
  }),
};
