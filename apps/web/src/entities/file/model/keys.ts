export const fileQueryKeys = {
  all: ["files"] as const,
  details: () => [...fileQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...fileQueryKeys.details(), id] as const,
} as const;
