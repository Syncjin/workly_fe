"use client";

import { Post } from "@/entities/post";
import { SelectBoard, SelectCategory } from "@/features/board/board-select";
import * as React from "react";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";

export type PostEditorState = {
  category?: SelectCategory;
  board?: SelectBoard;
  boardId?: number;
  title: string;
  json: string;
  post?: Post;
  isMustRead: boolean;
  mustReadChanged: boolean;
  setCategory: (v?: SelectCategory) => void;
  setBoard: (v?: SelectBoard) => void;
  setBoardId: (id?: number) => void;
  setTitle: (v: string) => void;
  setJson: (v: string) => void;
  setPost: (v?: Post) => void;
  setMustRead: (value: boolean) => void;
  setMustReadChanged: (value: boolean) => void;
  reset: () => void;
};

function makeStore() {
  return createStore<PostEditorState>((set) => ({
    category: undefined,
    board: undefined,
    boardId: undefined,
    title: "",
    json: "",
    isMustRead: false,
    mustReadChanged: false,
    setCategory: (v) => set({ category: v }),
    setBoard: (v) => set({ board: v }),
    setBoardId: (id) => set({ boardId: id }),
    setTitle: (v) => set({ title: v }),
    setJson: (v) => set({ json: v }),
    setPost: (v) => set({ post: v }),
    setMustRead: (value) => set({ isMustRead: value }),
    setMustReadChanged: (value) => set({ mustReadChanged: value }),
    reset: () =>
      set({
        category: undefined,
        board: undefined,
        boardId: undefined,
        title: "",
        json: "",
        post: undefined,
        isMustRead: false,
        mustReadChanged: false,
      }),
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
  const category = usePostEditorStore((s) => s.category);
  const board = usePostEditorStore((s) => s.board);
  const boardId = usePostEditorStore((s) => s.boardId);
  const title = usePostEditorStore((s) => s.title);
  const json = usePostEditorStore((s) => s.json);
  const post = usePostEditorStore((s) => s.post);
  const isMustRead = usePostEditorStore((s) => s.isMustRead);
  const mustReadChanged = usePostEditorStore((s) => s.mustReadChanged);

  return React.useMemo(
    () => ({
      category,
      board,
      boardId,
      title,
      json,
      post,
      isMustRead,
      mustReadChanged,
    }),
    [category, board, boardId, title, json, post, isMustRead, mustReadChanged]
  );
};

/** 편의 액션 훅들 */
export const usePostEditorActions = () => {
  const setCategory = usePostEditorStore((s) => s.setCategory);
  const setBoard = usePostEditorStore((s) => s.setBoard);
  const setBoardId = usePostEditorStore((s) => s.setBoardId);
  const setTitle = usePostEditorStore((s) => s.setTitle);
  const setJson = usePostEditorStore((s) => s.setJson);
  const setPost = usePostEditorStore((s) => s.setPost);
  const setMustRead = usePostEditorStore((s) => s.setMustRead);
  const setMustReadChanged = usePostEditorStore((s) => s.setMustReadChanged);
  const reset = usePostEditorStore((s) => s.reset);
  return { setCategory, setBoard, setBoardId, setTitle, setJson, setPost, setMustRead, setMustReadChanged, reset };
};
