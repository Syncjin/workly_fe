/**
 * Comment entity types
 *
 */

import { User } from "@/entities/users";
import { CommentDTO } from "@workly/types";

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
