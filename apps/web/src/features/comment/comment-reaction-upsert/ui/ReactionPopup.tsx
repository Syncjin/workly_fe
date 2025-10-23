"use client";

import { Comment, CommentReaction } from "@/entities/comment";
import * as styles from "@/features/comment/comment-reaction-upsert/ui/reactionPopup.css";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { useEscapeKey } from "@/shared/hooks/useEscapeKey";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useReactionUpsert } from "../model/useReactionUpsert";
import { ReactionSelector } from "./ReactionSelector";

export interface ReactionPopupOpeners {
  open: (comment: Comment) => void;
  close: () => void;
}

interface ReactionPopupState {
  open: boolean;
  selectedComment: Comment | null;
}

export const ReactionPopup = forwardRef<ReactionPopupOpeners>((_, ref) => {
  const [state, setState] = useState<ReactionPopupState>({
    open: false,
    selectedComment: null,
  });
  const popupRef = useRef<HTMLDivElement>(null);

  const { handleReactionSelect, loading } = useReactionUpsert({
    comment: state.selectedComment,
    onSuccess: (reaction) => {
      handleClose();
    },
    onError: (error) => {
      console.error("ReactionPopup Failed:", error);
    },
  });

  const handleClose = () => {
    setState({ open: false, selectedComment: null });
  };

  const handleOpen = (comment: Comment) => {
    setState({ open: true, selectedComment: comment });
  };

  const handleReactionClick = async (reactionType: CommentReaction) => {
    if (!state.selectedComment) return;
    await handleReactionSelect(reactionType);
  };

  useClickOutside(popupRef, handleClose);
  useEscapeKey(handleClose, state.open);

  useImperativeHandle(ref, () => ({
    open: handleOpen,
    close: handleClose,
  }));

  if (!state.open || !state.selectedComment) {
    return null;
  }

  return (
    <div ref={popupRef} className={styles.reactionPopup} role="tooltip" aria-label="댓글 반응 선택">
      <div className={styles.reactionPopupContent}>
        <ReactionSelector currentReaction={state.selectedComment.myReaction} onSelect={handleReactionClick} disabled={loading} />
      </div>
    </div>
  );
});

ReactionPopup.displayName = "ReactionPopup";
