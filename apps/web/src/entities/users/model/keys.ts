export const usersQueryKeys = {
  all: ["users"] as const,
  myInfo: () => [...usersQueryKeys.all, "myInfo"] as const,
  list: (params?: unknown) => [...usersQueryKeys.all, "list", params ?? {}] as const,
  detail: (userId: number) => [...usersQueryKeys.all, "detail", userId] as const,
  posts: (userId: number, params?: unknown) => [...usersQueryKeys.all, "posts", userId, params ?? {}] as const,
  myPosts: (params?: unknown) => [...usersQueryKeys.all, "myPosts", params ?? {}] as const,
} as const;
