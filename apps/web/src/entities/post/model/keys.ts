import { PostListParams } from "@/entities/post";

export const postQueryKeys = {
  all: ["posts"] as const,
  lists: () => [...postQueryKeys.all, "list"] as const,
  list: (params?: PostListParams) => [...postQueryKeys.lists(), params] as const,
  unreadLists: () => [...postQueryKeys.all, "unread", "list"] as const,
  unreadList: (params?: PostListParams) => [...postQueryKeys.unreadLists(), params] as const,
  details: () => [...postQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...postQueryKeys.details(), id] as const,
} as const;
