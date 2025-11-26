"use client";

import type { ModalClient } from "@workly/ui/overlays";
import { useModalStore } from "./store";

// zustand → ModalClient 어댑터
export const modalClient: ModalClient = {
  open: <T = unknown>(type: string, props?: unknown) => useModalStore.getState().open(type, props) as Promise<T | null>,
  resolve: (result: unknown, key?: string) => useModalStore.getState().resolve(result, key),
  cancel: (key?: string) => useModalStore.getState().cancel(key),
  subscribe: (l: () => void) => useModalStore.subscribe(l),
  getState: () => useModalStore.getState().current,
};
