import type { User } from "@/entities/users";

import { ROLE_PERMS, type PermissionKey } from "./policies";

export function hasPermission(user: User | null | undefined, perm: PermissionKey): boolean {
  if (!user) return false;
  const roles = Array.isArray(user.role) ? user.role : [user.role].filter(Boolean);
  return roles.some((r) => ROLE_PERMS[r]?.includes(perm));
}

export function isOwner(user: User | null | undefined, ownerId?: string | number | null): boolean {
  if (!user || ownerId == null) return false;
  return user.userId === ownerId;
}

export function can(
  user: User | null | undefined,
  perm: PermissionKey,
  opts?: {
    ownerId?: string | number | null;
    requireOwnership?: boolean; // default false
    allowAdminBypass?: boolean; // default true
  }
) {
  const { ownerId, requireOwnership = false, allowAdminBypass = true } = opts ?? {};
  const permitted = hasPermission(user, perm);
  if (!permitted) return false;

  if (!requireOwnership) return true;

  const iAmOwner = isOwner(user, ownerId);
  if (iAmOwner) return true;

  // 관리자 우회
  const isAdmin = Array.isArray(user?.role) ? user!.role.includes("ROLE_ADMIN" as any) : user?.role === ("ROLE_ADMIN" as any);

  return allowAdminBypass ? !!isAdmin : false;
}
