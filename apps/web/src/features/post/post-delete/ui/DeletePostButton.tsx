"use client";
import { PERM, usePermission } from "@/entities/permission";
import { usePostDeleteAction } from "@/features/post/post-delete";
import { ReactNode } from "react";

export type DeletePostRenderProps = {
  run: () => Promise<void>;
  isPending: boolean;
  isPermitted: boolean;
};

export function DeletePostButton({ postIds, children }: { postIds: number[]; children: (props: DeletePostRenderProps) => ReactNode }) {
  const { isPermitted } = usePermission(PERM.POST_DELETE);
  const { run, isPending } = usePostDeleteAction();

  async function handle() {
    if (!isPermitted || postIds.length === 0 || isPending) return;
    await run(postIds);
  }

  if (!isPermitted) return null;

  return <>{children({ run: handle, isPending, isPermitted })}</>;
}
