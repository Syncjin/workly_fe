"use client";
import React, { createContext, useContext, useSyncExternalStore } from "react";

import type { ModalClient, ModalState } from "./types";

const Ctx = createContext<ModalClient | null>(null);

export function ModalProvider({ client, children }: { client: ModalClient; children: React.ReactNode }) {
  return <Ctx.Provider value={client}>{children}</Ctx.Provider>;
}

export function useModal() {
  const client = useContext(Ctx);
  if (!client) throw new Error("ModalProvider가 필요합니다.");
  return {
    open: client.open.bind(client),
    resolve: client.resolve.bind(client),
    cancel: client.cancel.bind(client),
    client,
  };
}

export function useModalState(): ModalState {
  const client = useContext(Ctx);
  if (!client) throw new Error("ModalProvider가 필요합니다.");
  return useSyncExternalStore(client.subscribe.bind(client), client.getState.bind(client), client.getState.bind(client));
}
