"use client";

import { EmptyState, type EmptyStateProps, Icon } from "@workly/ui";

interface PostSectionErrorProps extends EmptyStateProps {
  error?: unknown;
  onRetry?: () => void;
}

/**
 * 게시글 섹션 에러 폴백 컴포넌트
 * 에러 발생 시 재요청 UI 표시
 */
export function PostSectionError({
  error,
  onRetry,
  title = "섹션을 불러올 수 없습니다",
  action = {
    label: "다시 불러오기",
    onClick: () => onRetry?.(),
  },
}: PostSectionErrorProps) {
  return <EmptyState title={title} description={process.env.NODE_ENV !== "production" ? `${String(JSON.stringify(error))}` : undefined} icon={<Icon name="error-warning-line" size={{ width: 48, height: 48 }} color="error-500" />} action={action} />;
}
