/**
 * Comment entity types
 *
 */

import { User } from "@/entities/users";
import { CommentDTO, CommentListParams, Pagination } from "@workly/types";

export type {
  CommentCreateRequest,
  CommentDeleteRequest,
  CommentDetailRequest,
  CommentDTO,
  CommentListParams,
  CommentReactionDTO as CommentReaction,
  CommentReactionDeleteRequest,
  CommentReactionParams,
  CommentReactionUpsertRequest,
  CommentUpdateRequest,
  ReactionDTO as Reaction,
} from "@workly/types";

export type Comment = Omit<CommentDTO, "user"> & {
  user: User;
};

// 무한 스크롤 훅/키용 파생 타입(페이지 제외
export type CommentListInfiniteParams = Readonly<Omit<CommentListParams, "page">>;

export type PageData = Pagination<Comment>;
