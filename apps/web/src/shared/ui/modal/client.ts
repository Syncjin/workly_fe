"use client";

import type { ModalClient } from "@workly/ui/overlays";
import { useModalStore } from "./store";

// zustand → ModalClient 어댑터
export const modalClient: ModalClient = {
  open: (type, props) => useModalStore.getState().open(type, props),
  resolve: (result) => useModalStore.getState().resolve(result),
  cancel: () => useModalStore.getState().cancel(),
  subscribe: (l) => useModalStore.subscribe(l),
  getState: () => useModalStore.getState().current,
};
