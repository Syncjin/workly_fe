/**
 * Post actions UI component
 */

"use client";

import type { Post } from "@/entities/post";
import { Button, Dropdown, Icon } from "@workly/ui";
import React from "react";
import type { PostActionConfig, PostActionsState } from "../model/types";
import { postActionsStyles } from "./postActions.css";

export interface PostActionsProps {
  /** The post to perform actions on */
  post: Post;
  /** Actions state and handlers */
  actions: PostActionsState;
  /** Configuration for which actions to show */
  config?: PostActionConfig;
  /** Additional CSS class name */
  className?: string;
}

export const PostActions: React.FC<PostActionsProps> = ({
  post,
  actions,
  config = {
    showLike: true,
    showBookmark: true,
    showShare: true,
    showEdit: false,
    showDelete: false,
  },
  className,
}) => {
  const { isLiking, isBookmarking, isSharing, handleLike, handleBookmark, handleShare, handleEdit, handleDelete } = actions;

  return (
    <div className={[postActionsStyles.container, className].filter(Boolean).join(" ")}>
      <div className={postActionsStyles.primaryActions}>
        {/* Like Button */}
        {config.showLike && (
          <Button variant="ghost" size="sm" onClick={() => handleLike(post)} disabled={isLiking} className={postActionsStyles.actionButton} aria-label="좋아요">
            <Icon name={isLiking ? "thumb-up-line" : "thumb-up-line"} size={{ width: 16, height: 16 }} color={isLiking ? "error-500" : "gray-500"} />
          </Button>
        )}

        {/* Bookmark Button */}
        {config.showBookmark && (
          <Button variant="ghost" size="sm" onClick={() => handleBookmark(post)} disabled={isBookmarking} className={postActionsStyles.actionButton} aria-label="북마크">
            <Icon name="star-line" size={{ width: 16, height: 16 }} color={isBookmarking ? "brand-500" : "gray-500"} />
          </Button>
        )}

        {/* Share Button */}
        {config.showShare && (
          <Button variant="ghost" size="sm" onClick={() => handleShare(post)} disabled={isSharing} className={postActionsStyles.actionButton} aria-label="공유">
            <Icon name="share-line" size={{ width: 16, height: 16 }} color="gray-500" />
          </Button>
        )}
      </div>

      {/* More Actions Dropdown */}
      {(config.showEdit || config.showDelete) && (
        <Dropdown>
          <Dropdown.Trigger>
            <Button variant="ghost" size="sm" className={postActionsStyles.moreButton} aria-label="더보기">
              <Icon name="more-line" size={{ width: 16, height: 16 }} />
            </Button>
          </Dropdown.Trigger>

          <Dropdown.Menu>
            {config.showEdit && (
              <Dropdown.Item onClick={() => handleEdit(post)}>
                <Icon name="settings-line" size={{ width: 16, height: 16 }} />
                수정
              </Dropdown.Item>
            )}

            {config.showDelete && (
              <Dropdown.Item onClick={() => handleDelete(post)}>
                <Icon name="delete-bin-line" size={{ width: 16, height: 16 }} />
                삭제
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
};
