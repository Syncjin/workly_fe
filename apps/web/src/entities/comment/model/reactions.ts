import { CommentReaction } from "./types";

export interface ReactionType {
  type: CommentReaction;
  emoji: string;
  label: string;
}

export const DEFAULT_REACTIONS: ReactionType[] = [
  { type: "LIKE", emoji: "👍", label: "좋아요" },
  { type: "LOVE", emoji: "❤️", label: "사랑해요" },
  { type: "LAUGH", emoji: "😂", label: "웃겨요" },
  { type: "SURPRISED", emoji: "😮", label: "놀라워요" },
  { type: "SAD", emoji: "😢", label: "슬퍼요" },
  { type: "ANGRY", emoji: "😡", label: "화나요" },
] as const;

export function getReactionEmoji(reactionType: CommentReaction): string {
  const reaction = DEFAULT_REACTIONS.find((r) => r.type === reactionType);
  return reaction?.emoji || "";
}
