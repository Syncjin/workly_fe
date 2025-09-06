export const boardCategoryQueryKeys = {
    all: ["boardCategory"] as const,
    list: () => [...boardCategoryQueryKeys.all, "list"] as const,
} as const;