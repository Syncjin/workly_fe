"use client";
import { PERM, useCan } from "@/entities/permission";
import { ReactNode } from "react";

export type UpdateCommentRenderProps = {
  isPending: boolean;
  isError: boolean;
};

// 작성자, 관리자만 노출
export function UpdateCommentButton({ children, ownerId }: { children: (props: UpdateCommentRenderProps) => ReactNode; ownerId: string }) {
  const { allowed, isPending, isError } = useCan(PERM.COMMENT_EDIT, { ownerId, requireOwnership: true });

  if (!allowed) return null;

  return <>{children({ isPending, isError })}</>;
}
