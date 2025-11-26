"use client";

import { Reaction } from "@/entities/comment";
import * as React from "react";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";

export type CommentThreadState = {
  commentCnt?: number;
  reaction?: Reaction;
  setCommentCnt: (v?: number) => void;
  setReaction: (v?: Reaction) => void;
  reset: () => void;
};

function makeStore() {
  return createStore<CommentThreadState>((set) => ({
    commentCnt: undefined,
    reaction: undefined,
    setCommentCnt: (v) => set({ commentCnt: v }),
    setReaction: (v) => set({ reaction: v }),
    reset: () => set({ commentCnt: undefined, reaction: undefined }),
  }));
}

const Ctx = React.createContext<StoreApi<CommentThreadState> | null>(null);

export function CommentThreadProvider({ children }: { children: React.ReactNode }) {
  const [store] = React.useState(() => makeStore());

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useCommentThreadStore<T>(selector: (s: CommentThreadState) => T) {
  const store = React.useContext(Ctx);
  if (!store) throw new Error("Missing <CommentThreadProvider>");
  return useStore(store, selector);
}

export const useCommentThreadState = () => {
  const commentCnt = useCommentThreadStore((s) => s.commentCnt);
  const reaction = useCommentThreadStore((s) => s.reaction);

  return React.useMemo(
    () => ({
      commentCnt,
      reaction,
    }),
    [commentCnt, reaction]
  );
};

/** 편의 액션 훅들 */
export const useCommentThreadActions = () => {
  const setCommentCnt = useCommentThreadStore((s) => s.setCommentCnt);
  const setReaction = useCommentThreadStore((s) => s.setReaction);
  const reset = useCommentThreadStore((s) => s.reset);
  return { setCommentCnt, setReaction, reset };
};
