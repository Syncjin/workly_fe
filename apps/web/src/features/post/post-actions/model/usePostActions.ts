/**
 * Post actions state management hook
 */

import type { Post } from "@/entities/post";
import { useState } from "react";
import type { PostActionsState } from "./types";

export interface UsePostActionsOptions {
  /** Callback when like action is triggered */
  onLike?: (post: Post) => Promise<void>;
  /** Callback when bookmark action is triggered */
  onBookmark?: (post: Post) => Promise<void>;
  /** Callback when share action is triggered */
  onShare?: (post: Post) => Promise<void>;
  /** Callback when edit action is triggered */
  onEdit?: (post: Post) => void;
  /** Callback when delete action is triggered */
  onDelete?: (post: Post) => Promise<void>;
}

export const usePostActions = (options: UsePostActionsOptions = {}): PostActionsState => {
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleLike = async (post: Post) => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      await options.onLike?.(post);
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async (post: Post) => {
    if (isBookmarking) return;

    setIsBookmarking(true);
    try {
      await options.onBookmark?.(post);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleShare = async (post: Post) => {
    if (isSharing) return;

    setIsSharing(true);
    try {
      await options.onShare?.(post);
    } finally {
      setIsSharing(false);
    }
  };

  const handleEdit = (post: Post) => {
    options.onEdit?.(post);
  };

  const handleDelete = async (post: Post) => {
    await options.onDelete?.(post);
  };

  return {
    isLiking,
    isBookmarking,
    isSharing,
    handleLike,
    handleBookmark,
    handleShare,
    handleEdit,
    handleDelete,
  };
};
