"use client";
import { PERM, useCan, useRole } from "@/entities/permission";
import { usePostDeleteAction } from "@/features/post/post-delete";
import { ReactNode } from "react";

export type DeletePostRenderProps = {
  run: () => Promise<void>;
  isPending: boolean;
};

export interface DeletePostButtonProps {
  postIds: number[];
  children: (props: DeletePostRenderProps) => ReactNode;
  ownerId?: string;
}

export function DeletePostButton({ postIds, children, ownerId }: DeletePostButtonProps) {
  // 관리자 권한 확인
  const { hasRole: isAdmin } = useRole("ROLE_ADMIN");

  // 관리자와 일반 사용자 구분 로직 - allowAdminBypass 기능 활용
  const permissionOptions = isAdmin
    ? { ownerId, requireOwnership: false, allowAdminBypass: true } // 관리자인 경우 소유권 확인 우회
    : { ownerId, requireOwnership: true, allowAdminBypass: true }; // 일반 사용자인 경우 기존 로직 유지

  const { allowed } = useCan(PERM.POST_DELETE, permissionOptions);
  const { run, isPending } = usePostDeleteAction();

  if (!allowed) return null;

  async function handle() {
    if (!allowed || postIds.length === 0 || isPending) return;
    await run(postIds);
  }

  return <>{children({ run: handle, isPending })}</>;
}
