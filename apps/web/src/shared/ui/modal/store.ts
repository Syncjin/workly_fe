"use client";
import type { ModalKey } from "@workly/ui/overlays";
import { create } from "zustand";

type Resolver = ((v: any) => void) | null;

type ModalSlice = {
  current: { type: ModalKey | null; props?: any };
  _resolver: Resolver; // 프라미스 resolve를 저장
  open: (type: ModalKey, props?: any) => Promise<any | null>;
  resolve: (result: any) => void;
  cancel: () => void;
};

export const useModalStore = create<ModalSlice>((set, get) => ({
  current: { type: null },
  _resolver: null,

  open: (type, props) =>
    new Promise((resolve) => {
      // 기존 대기 프라미스가 있으면 취소하고 교체(원하면 큐잉으로 확장 가능)
      const prev = get()._resolver;
      prev?.(null);
      set({ current: { type, props }, _resolver: resolve });
    }),

  resolve: (result) => {
    const r = get()._resolver;
    r?.(result);
    set({ current: { type: null }, _resolver: null });
  },

  cancel: () => {
    const r = get()._resolver;
    r?.(null);
    set({ current: { type: null }, _resolver: null });
  },
}));
