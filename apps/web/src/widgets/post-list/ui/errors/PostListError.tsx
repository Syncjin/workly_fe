"use client";

import { EmptyState, Icon } from "@workly/ui";

export const PostListError = ({ error, onRetry }: { error?: unknown; onRetry?: () => void }) => {
  return (
    <EmptyState
      title={"게시글 목록을 불러올 수 없습니다"}
      description={`${String(JSON.stringify(error))}`}
      icon={<Icon name="error-warning-line" size={{ width: 48, height: 48 }} color="error-500" />}
      action={{
        label: "다시 불러오기",
        onClick: () => onRetry?.(),
      }}
    />
  );
};
