/**
 * Post entity types
 *
 */

import { Board } from "@/entities/board";
import { FileInfo } from "@/entities/file/model";
import { User } from "@/entities/users/model";
import { PageParams } from "@/shared/api/types";

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

export interface PostListParams extends PageParams {
  boardId?: number;
  categoryId?: number;
  keyword?: string;
}

export interface PostByIdReadRequest {
  postId: number;
}

export interface PostDeleteRequest {
  postIds: number[];
}
