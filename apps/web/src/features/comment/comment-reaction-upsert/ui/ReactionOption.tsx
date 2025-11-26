import { CommentReaction } from "@/entities/comment";
import * as styles from "./reactionSelector.css";

interface ReactionOptionProps {
  type: CommentReaction;
  emoji: string;
  label: string;
  count?: number;
  isSelected?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const ReactionOption = ({ emoji, label, count, isSelected = false, onClick, disabled = false }: ReactionOptionProps) => {
  return (
    <button type="button" className={`${styles.reactionOption} ${isSelected ? styles.reactionOptionSelected : ""}`} onClick={onClick} disabled={disabled} aria-label={`${label} 반응${count ? ` (${count}개)` : ""}`} title={label}>
      <span className={styles.reactionEmoji}>{emoji}</span>
      {count !== undefined && count > 0 && <span className={styles.reactionCount}>{count}</span>}
    </button>
  );
};
