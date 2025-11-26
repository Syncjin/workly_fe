import localFont from "next/font/local";

export const pretendard = localFont({
  src: [
    {
      path: "../../public/fonts/Pretendard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "fallback", // swap에서 fallback으로 변경하여 깜빡임 최소화
  preload: true, // 중요한 폰트이므로 프리로드 활성화
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
});
