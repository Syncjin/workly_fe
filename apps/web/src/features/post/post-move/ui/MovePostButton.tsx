"use client";
import { PERM, useCan, useRole } from "@/entities/permission";
import { usePostMoveAction } from "@/features/post/post-move/model";
import { ReactNode } from "react";

export type MovePostRenderProps = {
  run: (targetBoardId: number) => Promise<void>;
  isPending: boolean;
};

export interface MovePostButtonProps {
  postIds: number[];
  children: (props: MovePostRenderProps) => ReactNode;
  ownerId?: string;
}

export function MovePostButton({ postIds, children, ownerId }: MovePostButtonProps) {
  // 관리자 권한 확인
  const { hasRole: isAdmin } = useRole("ROLE_ADMIN");

  const permissionOptions = isAdmin ? { ownerId, requireOwnership: false, allowAdminBypass: true } : { ownerId, requireOwnership: true, allowAdminBypass: true };

  const { allowed } = useCan(PERM.POST_MOVE, permissionOptions);
  const { run, isPending } = usePostMoveAction();

  if (!allowed) return null;

  async function handle(targetBoardId: number) {
    if (!allowed || postIds.length === 0 || isPending) return;
    await run(postIds, targetBoardId);
  }

  return <>{children({ run: handle, isPending })}</>;
}
