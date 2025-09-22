/**
 * Post entity types
 *
 */

import { Board } from "@/entities/board";
import { FileInfo } from "@/entities/file/model";
import { User } from "@/entities/users/model";

type BoardSummary = Pick<Board, "boardId" | "boardName">;

export interface Post {
  postId: number;
  title: string;
  content: string;
  board: BoardSummary;
  fileInfos: FileInfo[];
  commentsCount: number;
  likesCount: number;
  createdDateTime: string;
  updatedDateTime: string;
  deletedDateTime: string;
  trashedDateTime: string;
  user: User;
  isLiked: boolean;
  isBookmarked: boolean;
  mustRead: boolean;
  isRead: boolean;
  readCount: number;
}

export interface Pagination<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  prevPage: number;
  nextPage: number;
}

export interface StableUrlParams {
  boardId?: number;
  categoryId?: number;
}

export interface DynamicUrlParams {
  keyword?: string;
  page?: number;
  size?: number;
}
export interface PostListParams extends StableUrlParams, DynamicUrlParams {}

export type PostListContainerProps = StableUrlParams;

export interface PostByIdReadRequest {
  postId: number;
}
