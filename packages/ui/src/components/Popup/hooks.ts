"use client";

import { useEffect, useRef, useState } from "react";

type RefLike = { current: HTMLElement | null };

/** #popup-portal 있으면 사용, 없으면 body 사용 */
export function usePortalContainer(): HTMLElement | null {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setEl(document.getElementById("popup-portal") || document.body);
  }, []);
  return el;
}

/** ESC 키로 닫기 */
export function useEscapeClose(enabled: boolean, onClose?: () => void) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [enabled, onClose]);
}

/** 오버레이 클릭 시 닫기(팝업 내부 클릭 제외) */
export function useOutsideClose(popupRef: RefLike, overlayRef: RefLike, enabled: boolean, onClose?: () => void) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!popupRef.current || !overlayRef.current) return;
      if (overlayRef.current.contains(target) && !popupRef.current.contains(target)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [enabled, onClose, popupRef, overlayRef]);
}

/** open 상태와 애니메이션 시간에 따라 실제 마운트 가시성 관리 */
export function useVisibility(open: boolean, animationMs: number) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        setVisible(true);
      });
      return;
    }
    if (visible) {
      timerRef.current = window.setTimeout(() => setVisible(false), animationMs);
      return () => {
        if (timerRef.current) window.clearTimeout(timerRef.current);
      };
    }
  }, [open, visible, animationMs]);

  return visible;
}

/** 포커스 트랩 + 이전 포커스 복원 */
export function useFocusTrap(open: boolean, trap: boolean, rootRef: RefLike) {
  const prevFocus = useRef<HTMLElement | null>(null);

  // 이전 포커스 저장/복원
  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement as HTMLElement;
    return () => {
      const el = prevFocus.current;
      if (el && document.contains(el)) el.focus();
    };
  }, [open]);

  // 트랩
  useEffect(() => {
    if (!open || !trap || !rootRef.current) return;

    const node = rootRef.current;
    const q = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"]):not([disabled])';
    const list = Array.from(node.querySelectorAll(q)) as HTMLElement[];
    list[0]?.focus();

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || list.length === 0) return;
      const first = list[0],
        last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [open, trap, rootRef]);
}
