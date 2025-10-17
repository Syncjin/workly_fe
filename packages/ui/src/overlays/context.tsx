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
  const { open, resolve, cancel } = client;
  return { open, resolve, cancel, client };
}

export function useModalState(): ModalState {
  const client = useContext(Ctx);
  if (!client) throw new Error("ModalProvider가 필요합니다.");
  return useSyncExternalStore(client.subscribe, client.getState, client.getState);
}
