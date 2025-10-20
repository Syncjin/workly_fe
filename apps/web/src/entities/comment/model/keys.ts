import { CommentListInfiniteParams, CommentListParams } from "./types";

export const commentQueryKeys = {
  all: ["comments"] as const,
  lists: () => [...commentQueryKeys.all, "list"] as const,
  list: (params?: CommentListParams) => [...commentQueryKeys.lists(), params] as const,
  infiniteLists: () => [...commentQueryKeys.all, "infinite"] as const,
  infinite: (params: CommentListInfiniteParams) => [...commentQueryKeys.infiniteLists(), params] as const,
  details: () => [...commentQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...commentQueryKeys.details(), id] as const,
  reaction: (id: number) => [...commentQueryKeys.all, "reaction", id] as const,
} as const;
