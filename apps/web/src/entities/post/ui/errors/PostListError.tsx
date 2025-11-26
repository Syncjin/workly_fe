"use client";

import { EmptyState, type EmptyStateProps, Icon } from "@workly/ui";

interface PostListErrorProps extends EmptyStateProps {
  error?: unknown;
  onRetry?: () => void;
}

export const PostListError = ({
  error,
  onRetry,
  title = "게시글 목록을 불러올 수 없습니다",
  action = {
    label: "다시 불러오기",
    onClick: () => onRetry?.(),
  },
}: PostListErrorProps) => {
  return <EmptyState title={title} description={`${String(JSON.stringify(error))}`} icon={<Icon name="error-warning-line" size={{ width: 48, height: 48 }} color="error-500" />} action={action} />;
};
