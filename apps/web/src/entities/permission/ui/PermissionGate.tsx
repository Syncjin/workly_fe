"use client";
import { ReactNode } from "react";
import type { PermissionKey } from "../lib/policies";
import { usePermission } from "../model/usePermission";

export function PermissionGate({ perm, fallback = null, children }: { perm: PermissionKey; fallback?: ReactNode; children: ReactNode }) {
  const { isPermitted, isLoading } = usePermission(perm);
  if (isLoading) return null;
  return isPermitted ? <>{children}</> : <>{fallback}</>;
}
