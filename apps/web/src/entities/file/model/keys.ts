export const fileQueryKeys = {
  all: ["files"] as const,
  details: () => [...fileQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...fileQueryKeys.details(), id] as const,
} as const;
