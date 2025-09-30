/**
 * Post feature exports
 *
 * Exports all post-related functionality including API functions, types, and feature components.
 */

// Re-export from entities for backward compatibility
export { postApi, postQueryKeys, usePostList } from "@/entities/post";
export type { PostListParams } from "@/entities/post/model/types";

// Export post features
export { PostFilters, usePostFilters } from "./post-filters";
export type { PostFiltersState, PostFiltersType } from "./post-filters";

export { PostSearch, usePostSearch } from "./post-search";
export type { PostSearchState } from "./post-search";

export { PostActions, usePostActions } from "./post-actions";
export type { PostActionConfig, PostActionsState, UsePostActionsOptions } from "./post-actions";
