import type { BoardDTO, FileInfoDTO, UserDTO } from "@workly/types";

type BoardSummary = Pick<BoardDTO, "boardId" | "boardName">;

export interface PostDTO {
  postId: number;
  title: string;
  content: string;
  board: BoardSummary;
  fileInfos: FileInfoDTO[];
  commentsCount: number;
  likesCount: number;
  createdDateTime: string;
  updatedDateTime: string;
  deletedDateTime: string;
  trashedDateTime: string;
  user: UserDTO;
  isLiked: boolean;
  isBookmarked: boolean;
  mustRead: boolean;
  isRead: boolean;
  readCount: number;
}

export interface PostMoveResponse {
  boardId: number;
  requestedCount: number;
  movedCount: number;
  movedIds: number[];
}
