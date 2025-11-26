"use client";
import { PERM, useCan } from "@/entities/permission";
import { ReactNode } from "react";

export type DeleteCommentRenderProps = {
  isPending: boolean;
  isError: boolean;
};

// 작성자, 관리자만 노출
export function DeleteCommentButton({ children, ownerId }: { children: (props: DeleteCommentRenderProps) => ReactNode; ownerId: string }) {
  const { allowed, isPending, isError } = useCan(PERM.COMMENT_DELETE, { ownerId, requireOwnership: true });

  if (!allowed) return null;

  return <>{children({ isPending, isError })}</>;
}
