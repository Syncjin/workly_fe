import { style } from "@vanilla-extract/css";

export const header = style({
  fontWeight: 600,
  fontSize: "20px",
  lineHeight: "30px",
  color: "#000",
});

export const container = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

export const listView = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  marginTop: 24,
  borderTopWidth: "1px",
  borderTopColor: "var(--color-gray-300)",
  borderTopStyle: "solid",
});

export const toolbar = {
  container: style({
    marginTop: 24,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12, // 16에서 12로 축소
    // 태블릿에서 간격 조정
    "@media": {
      "screen and (max-width: 1024px)": {
        gap: 10,
      },
      // 모바일에서 세로 정렬
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
    gap: 8, // 10에서 8로 축소
    flexWrap: "wrap",
    minWidth: 0, // flex 아이템이 축소될 수 있도록
    flex: 1, // 남은 공간을 차지하도록
    // 태블릿에서 간격 조정
    "@media": {
      "screen and (max-width: 1024px)": {
        gap: 8,
      },
      // 모바일에서 간격 조정
      "screen and (max-width: 768px)": {
        gap: 8,
        justifyContent: "flex-start",
        width: "100%",
        flex: "none", // 모바일에서는 flex 해제
      },
    },
  }),
  rightArea: style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // 12에서 8로 축소
    flexShrink: 0,
    // 태블릿에서 간격 조정
    "@media": {
      "screen and (max-width: 1024px)": {
        gap: 8,
      },
      // 모바일에서 전체 너비 사용
      "screen and (max-width: 768px)": {
        width: "100%",
        justifyContent: "space-between",
        gap: 8,
      },
      // 작은 모바일에서 세로 정렬
      "screen and (max-width: 480px)": {
        flexDirection: "column",
        gap: 8,
        alignItems: "stretch",
      },
    },
  }),
};
