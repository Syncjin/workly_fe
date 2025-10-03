"use client";
import { registry as boardSelectRegistry } from "@/features/board/board-select";
import { modalClient } from "@/shared/ui/modal/client";
import { ModalHost, ModalProvider } from "@workly/ui/overlays";
import React from "react";

const loaders = {
  ...boardSelectRegistry,
};

export default function ModalProviders({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider client={modalClient}>
      {children}
      <ModalHost loaders={loaders} fallback={<div style={{ padding: 12 }}>Loading…</div>} />
    </ModalProvider>
  );
}
