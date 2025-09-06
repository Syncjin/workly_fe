export const boardQueryKeys = {
    all: ["boards"] as const,
    list: () => [...boardQueryKeys.all, "list"] as const,
} as const;