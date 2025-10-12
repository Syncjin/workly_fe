"use client";

import * as React from "react";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";

export type PostEditorState = {
  boardId?: number;
  title: string;
  json: string;
  setBoardId: (id?: number) => void;
  setTitle: (v: string) => void;
  setJson: (v: string) => void;
  reset: () => void;
};

function makeStore() {
  return createStore<PostEditorState>((set) => ({
    boardId: undefined,
    title: "",
    json: "",
    setBoardId: (id) => set({ boardId: id }),
    setTitle: (v) => set({ title: v }),
    setJson: (v) => set({ json: v }),
    reset: () => set({ boardId: undefined, title: "", json: "" }),
  }));
}

const Ctx = React.createContext<StoreApi<PostEditorState> | null>(null);

export function PostEditorProvider({ children }: { children: React.ReactNode }) {
  const [store] = React.useState(() => makeStore());

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function usePostEditorStore<T>(selector: (s: PostEditorState) => T) {
  const store = React.useContext(Ctx);
  if (!store) throw new Error("Missing <PostEditorProvider>");
  return useStore(store, selector);
}

export const usePostEditorState = () => {
  const boardId = usePostEditorStore((s) => s.boardId);
  const title = usePostEditorStore((s) => s.title);
  const json = usePostEditorStore((s) => s.json);

  return React.useMemo(
    () => ({
      boardId,
      title,
      json,
    }),
    [boardId, title, json]
  );
};

/** 편의 액션 훅들 */
export const usePostEditorActions = () => {
  const setBoardId = usePostEditorStore((s) => s.setBoardId);
  const setTitle = usePostEditorStore((s) => s.setTitle);
  const setJson = usePostEditorStore((s) => s.setJson);
  const reset = usePostEditorStore((s) => s.reset);
  return { setBoardId, setTitle, setJson, reset };
};
