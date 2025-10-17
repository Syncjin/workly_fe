"use client";

import { AuthProvider } from "@/lib/providers/AuthProvider";
import { modalClient } from "@/shared/ui/modal/client";
import type { LoaderRegistry } from "@workly/ui/overlays";
import { ModalHost, ModalProvider } from "@workly/ui/overlays";
import React from "react";

import { registry as boardSelectRegistry } from "@/features/board/board-select";
import { confirmRegistry, loadingRegistry } from "@/shared/ui/modal/model";

const loaders: LoaderRegistry = {
  ...boardSelectRegistry,
  ...loadingRegistry,
  ...confirmRegistry,
};

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider client={modalClient}>
      <AuthProvider fallback={null}>{children}</AuthProvider>

      <ModalHost loaders={loaders} fallback={<div style={{ padding: 12 }}>Loading…</div>} />
    </ModalProvider>
  );
}
