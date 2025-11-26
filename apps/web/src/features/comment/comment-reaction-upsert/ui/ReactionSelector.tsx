import { CommentReaction } from "@/entities/comment";
import { DEFAULT_REACTIONS, type ReactionType } from "../model/constants";
import { ReactionOption } from "./ReactionOption";
import * as styles from "./reactionSelector.css";

interface ReactionSelectorProps {
  currentReaction?: CommentReaction;
  reactions?: ReactionType[];
  onSelect: (reactionType: CommentReaction) => void;
  disabled?: boolean;
  reactionCounts?: Record<CommentReaction, number>;
}

export const ReactionSelector = ({ currentReaction, reactions = DEFAULT_REACTIONS, onSelect, disabled = false, reactionCounts }: ReactionSelectorProps) => {
  return (
    <div className={styles.reactionSelector} role="group" aria-label="댓글 반응 선택">
      {reactions.map((reaction) => (
        <ReactionOption key={reaction.type} type={reaction.type} emoji={reaction.emoji} label={reaction.label} count={reactionCounts?.[reaction.type]} isSelected={currentReaction === reaction.type} onClick={() => onSelect(reaction.type)} disabled={disabled} />
      ))}
    </div>
  );
};
