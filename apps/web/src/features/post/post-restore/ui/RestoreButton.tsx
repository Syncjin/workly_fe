/**
 * 게시글 복원 버튼 컴포넌트
 */

"use client";
import { PERM, useCan, useRole } from "@/entities/permission";
import { ReactNode } from "react";
import { usePostRestoreAction } from "../model/usePostRestoreAction";

export type RestoreRenderProps = {
  run: (boardId: number) => Promise<void>;
  isPending: boolean;
};

export interface RestoreButtonProps {
  postIds: number[];
  children: (props: RestoreRenderProps) => ReactNode;
  ownerId?: string;
}

export function RestoreButton({ postIds, children, ownerId }: RestoreButtonProps) {
  const { hasRole: isAdmin } = useRole("ROLE_ADMIN");

  const permissionOptions = isAdmin ? { ownerId, requireOwnership: false, allowAdminBypass: true } : { ownerId, requireOwnership: true, allowAdminBypass: true };

  const { allowed } = useCan(PERM.POST_MOVE, permissionOptions);
  const { run: restoreAction, isPending } = usePostRestoreAction();

  if (!allowed) return null;

  async function handle(boardId: number) {
    if (!allowed || postIds.length === 0 || isPending) return;
    await restoreAction(postIds, boardId);
  }

  return <>{children({ run: handle, isPending })}</>;
}
