"use client";
import { PERM, useCan } from "@/entities/permission";
import { ReactNode } from "react";

export type UpdatePostRenderProps = {
  isPending: boolean;
  isError: boolean;
};

export function UpdatePostButton({ children, ownerId }: { children: (props: UpdatePostRenderProps) => ReactNode; ownerId: string }) {
  const { allowed, isPending, isError } = useCan(PERM.POST_EDIT, { ownerId, requireOwnership: true });

  if (!allowed) return null;

  return <>{children({ isPending, isError })}</>;
}
