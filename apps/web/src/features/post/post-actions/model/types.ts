/**
 * Post actions types and interfaces
 */

import type { Post } from "@/entities/post";

export interface PostActionsState {
  /** Loading states for different actions */
  isLiking: boolean;
  isBookmarking: boolean;
  isSharing: boolean;

  /** Action handlers */
  handleLike: (post: Post) => Promise<void>;
  handleBookmark: (post: Post) => Promise<void>;
  handleShare: (post: Post) => Promise<void>;
  handleEdit: (post: Post) => void;
  handleDelete: (post: Post) => Promise<void>;
}

export interface PostActionConfig {
  /** Show like button */
  showLike?: boolean;
  /** Show bookmark button */
  showBookmark?: boolean;
  /** Show share button */
  showShare?: boolean;
  /** Show edit button */
  showEdit?: boolean;
  /** Show delete button */
  showDelete?: boolean;
}
