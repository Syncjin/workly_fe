"use client";
import type { ModalKey } from "@workly/ui/overlays";
import { create } from "zustand";

type Resolver = ((v: any) => void) | null;

// 스크롤 락 관리를 위한 유틸리티
let scrollLockCount = 0;
let originalBodyStyle: {
  overflow: string;
  position: string;
  top: string;
  width: string;
} | null = null;
let scrollY = 0;

function lockBodyScroll() {
  if (scrollLockCount === 0) {
    scrollY = window.scrollY;
    originalBodyStyle = {
      overflow: window.getComputedStyle(document.body).overflow,
      position: window.getComputedStyle(document.body).position,
      top: window.getComputedStyle(document.body).top,
      width: window.getComputedStyle(document.body).width,
    };

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
  }
  scrollLockCount++;
}

function unlockBodyScroll() {
  scrollLockCount--;
  if (scrollLockCount === 0 && originalBodyStyle) {
    document.body.style.overflow = originalBodyStyle.overflow;
    document.body.style.position = originalBodyStyle.position;
    document.body.style.top = originalBodyStyle.top;
    document.body.style.width = originalBodyStyle.width;

    window.scrollTo(0, scrollY);
    originalBodyStyle = null;
  }
}

type ModalSlice = {
  current: { type: ModalKey | null; props?: any };
  _resolver: Resolver; // 프라미스 resolve를 저장
  open: (type: ModalKey, props?: any) => Promise<any | null>;
  resolve: (result: any, key?: ModalKey) => void;
  cancel: (key?: ModalKey) => void;
};

export const useModalStore = create<ModalSlice>((set, get) => ({
  current: { type: null },
  _resolver: null,

  open: (type, props) =>
    new Promise((resolve) => {
      const prev = get()._resolver;
      prev?.(null);
      lockBodyScroll();
      set({ current: { type, props }, _resolver: resolve });
    }),

  resolve: (result, key) => {
    const { current, _resolver } = get();
    if (key && current.type !== key) return;
    _resolver?.(result);
    unlockBodyScroll();
    set({ current: { type: null }, _resolver: null });
  },

  cancel: (key) => {
    const { current, _resolver } = get();
    if (key && current.type !== key) return;
    _resolver?.(null);
    unlockBodyScroll();
    set({ current: { type: null }, _resolver: null });
  },
}));
