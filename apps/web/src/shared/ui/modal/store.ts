"use client";
import type { ModalKey } from "@workly/ui/overlays";
import { create } from "zustand";

type Resolver = ((v: any) => void) | null;

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
      set({ current: { type, props }, _resolver: resolve });
    }),

  resolve: (result, key) => {
    const { current, _resolver } = get();
    if (key && current.type !== key) return;
    _resolver?.(result);
    set({ current: { type: null }, _resolver: null });
  },

  cancel: (key) => {
    const { current, _resolver } = get();
    if (key && current.type !== key) return;
    _resolver?.(null);
    set({ current: { type: null }, _resolver: null });
  },
}));
