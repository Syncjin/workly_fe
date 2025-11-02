import type { PageParams, PostListParams, PostMustReadListParams } from "@/entities/post";

export const postQueryKeys = {
  all: ["posts"] as const,
  lists: () => [...postQueryKeys.all, "list"] as const,
  list: (params?: PostListParams) => [...postQueryKeys.lists(), params] as const,
  unreadLists: () => [...postQueryKeys.all, "unread", "list"] as const,
  unreadList: (params?: PostListParams) => [...postQueryKeys.unreadLists(), params] as const,
  details: () => [...postQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...postQueryKeys.details(), id] as const,
  trashLists: () => [...postQueryKeys.all, "trash", "list"] as const,
  trash: (params?: PageParams) => [...postQueryKeys.trashLists(), params] as const,
  myPostsLists: () => [...postQueryKeys.all, "my-posts", "list"] as const,
  myPosts: (params?: PageParams) => [...postQueryKeys.myPostsLists(), params] as const,
  mustReadLists: () => [...postQueryKeys.all, "must-read", "list"] as const,
  mustRead: (params?: PostMustReadListParams) => [...postQueryKeys.mustReadLists(), params] as const,
  bookmarksLists: () => [...postQueryKeys.all, "bookmarks", "list"] as const,
  bookmarks: (params?: PageParams) => [...postQueryKeys.bookmarksLists(), params] as const,
} as const;
