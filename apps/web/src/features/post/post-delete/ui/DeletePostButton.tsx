"use client";
import { PERM, useCan } from "@/entities/permission";
import { usePostDeleteAction } from "@/features/post/post-delete";
import { ReactNode } from "react";

export type DeletePostRenderProps = {
  run: () => Promise<void>;
  isPending: boolean;
};

export function DeletePostButton({ postIds, children, ownerId }: { postIds: number[]; children: (props: DeletePostRenderProps) => ReactNode; ownerId: string }) {
  const { allowed } = useCan(PERM.POST_DELETE, { ownerId, requireOwnership: true });
  const { run, isPending } = usePostDeleteAction();

  if (!allowed) return null;

  async function handle() {
    if (!allowed || postIds.length === 0 || isPending) return;
    await run(postIds);
  }

  return <>{children({ run: handle, isPending })}</>;
}
