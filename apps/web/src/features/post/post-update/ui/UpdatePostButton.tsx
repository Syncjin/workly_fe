"use client";
import { PERM, usePermission } from "@/entities/permission";
import { ReactNode } from "react";

export type UpdatePostRenderProps = {
  isPermitted: boolean;
  isPending: boolean;
  isError: boolean;
};

export function UpdatePostButton({ children }: { children: (props: UpdatePostRenderProps) => ReactNode }) {
  const { isPermitted, isPending, isError } = usePermission(PERM.POST_EDIT);

  if (!isPermitted) return null;

  return <>{children({ isPermitted, isPending, isError })}</>;
}
