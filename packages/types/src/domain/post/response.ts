import type { BoardDTO } from "@workly/types/domain/board/response";
import type { FileInfoDTO } from "@workly/types/domain/file/response";
import type { UserDTO } from "@workly/types/domain/users/request";

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
