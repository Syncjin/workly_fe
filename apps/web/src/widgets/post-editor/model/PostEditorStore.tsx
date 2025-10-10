"use client";

import * as React from "react";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";

export type PostEditorState = {
  boardId?: number;
  title: string;
  html: string;
  setBoardId: (id?: number) => void;
  setTitle: (v: string) => void;
  setHtml: (v: string) => void;
  reset: () => void;
};

function makeStore() {
  return createStore<PostEditorState>((set) => ({
    boardId: undefined,
    title: "",
    html: "",
    setBoardId: (id) => set({ boardId: id }),
    setTitle: (v) => set({ title: v }),
    setHtml: (v) => set({ html: v }),
    reset: () => set({ boardId: undefined, title: "", html: "" }),
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
  const html = usePostEditorStore((s) => s.html);

  return React.useMemo(
    () => ({
      boardId,
      title,
      html,
    }),
    [boardId, title, html]
  );
};

/** 편의 액션 훅들 */
export const usePostEditorActions = () => {
  const setBoardId = usePostEditorStore((s) => s.setBoardId);
  const setTitle = usePostEditorStore((s) => s.setTitle);
  const setHtml = usePostEditorStore((s) => s.setHtml);
  const reset = usePostEditorStore((s) => s.reset);
  return { setBoardId, setTitle, setHtml, reset };
};
