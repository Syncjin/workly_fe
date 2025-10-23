import { Comment, CommentReaction } from "@/entities/comment";

export interface UseReactionUpsertProps {
  comment: Comment | null;
  onSuccess?: (reaction?: CommentReaction) => void;
  onError?: (error: Error) => void;
}

export interface ReactionUpsertResult {
  handleReactionSelect: (reactionType: CommentReaction) => Promise<void>;
  loading: boolean;
}
