import { UserDTO } from "@workly/types";

export type CommentReactionDTO = "LIKE" | "SAD" | "LAUGH" | "ANGRY" | "LOVE" | "SURPRISED";

export type ReactionDTO = {
  additionalProp1: number;
  additionalProp2: number;
  additionalProp3: number;
};

export interface CommentDTO {
  commentId: number; //댓글 ID
  content: string; //댓글 내용
  user: UserDTO;
  postId: number;
  createdDateTime: string; //작성일
  updatedDateTime: string; //수정일
  deletedDateTime: string; //삭제일
  reactions: ReactionDTO;
  myReaction: CommentReactionDTO; //댓글 리액션 종류
}
