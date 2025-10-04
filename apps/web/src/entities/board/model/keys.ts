import { BoardParams } from "@workly/types";

export const boardQueryKeys = {
  all: ["boards"] as const,
  lists: () => [...boardQueryKeys.all, "list"] as const,
  list: (params?: BoardParams) => [...boardQueryKeys.lists(), params] as const,
  details: () => [...boardQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...boardQueryKeys.details(), id] as const,
} as const;
