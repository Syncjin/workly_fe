export const boardQueryKeys = {
  all: ["boards"] as const,
  list: () => [...boardQueryKeys.all, "list"] as const,
  details: () => [...boardQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...boardQueryKeys.details(), id] as const,
} as const;
