import { useLayoutEffect } from "react";

/** 모달 열릴 때 body 스크롤 방지 */
export function useBodyScrollLock(enabled: boolean) {
  // useLayoutEffect를 사용해서 DOM 변경 전에 동기적으로 실행
  useLayoutEffect(() => {
    if (!enabled) return;

    // 현재 스크롤 위치 저장
    const scrollY = window.scrollY;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPosition = window.getComputedStyle(document.body).position;
    const originalTop = window.getComputedStyle(document.body).top;
    const originalWidth = window.getComputedStyle(document.body).width;

    // 스크롤 막기 + 스크롤 위치 고정
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      // 원래 스타일 복원
      document.body.style.overflow = originalStyle;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;

      // 스크롤 위치 복원
      window.scrollTo(0, scrollY);
    };
  }, [enabled]);
}
