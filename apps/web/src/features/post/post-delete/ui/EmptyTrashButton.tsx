"use client";
import { PERM, useCan, useRole } from "@/entities/permission";
import { ReactNode } from "react";
import { usePostTrashAction } from "../model/usePostTrashAction";

export type EmptyTrashRenderProps = {
  run: () => Promise<void>;
  isPending: boolean;
};

export interface EmptyTrashButtonProps {
  children: (props: EmptyTrashRenderProps) => ReactNode;
}

export function EmptyTrashButton({ children }: EmptyTrashButtonProps) {
  const { hasRole: isAdmin } = useRole("ROLE_ADMIN");

  const permissionOptions = isAdmin ? { requireOwnership: false, allowAdminBypass: true } : { requireOwnership: true, allowAdminBypass: true };

  const { allowed } = useCan(PERM.POST_DELETE, permissionOptions);
  const { run: emptyTrash, isPending } = usePostTrashAction();

  if (!allowed) return null;

  async function handle() {
    if (!allowed || isPending) return;
    await emptyTrash();
  }

  return <>{children({ run: handle, isPending })}</>;
}
