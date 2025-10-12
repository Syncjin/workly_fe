"use client";

import type { ModalClient } from "@workly/ui/overlays";
import { useModalStore } from "./store";

// zustand → ModalClient 어댑터
export const modalClient: ModalClient = {
  open: (type, props) => useModalStore.getState().open(type, props),
  resolve: (result, key?) => useModalStore.getState().resolve(result, key),
  cancel: (key?) => useModalStore.getState().cancel(key),
  subscribe: (l) => useModalStore.subscribe(l),
  getState: () => useModalStore.getState().current,
};
