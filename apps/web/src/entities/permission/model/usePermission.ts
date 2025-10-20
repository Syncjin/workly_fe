import { type PermissionKey } from "@/entities/permission/lib/policies";
import { useMyInfoSuspense } from "@/entities/users";
import type { UserRole } from "@workly/types";
import { can, isOwner } from "../lib/can";

export function usePermission(perm: PermissionKey) {
  const { data, isPending, isError } = useMyInfoSuspense();
  const user = data.data;
  return { isPermitted: can(user, perm), isPending, isError };
}

export function useRole(role: UserRole) {
  const { data, isPending, isError } = useMyInfoSuspense();
  const user = data.data;
  const roles = Array.isArray(user?.role) ? user?.role : [user?.role].filter(Boolean);
  return { hasRole: !!roles?.includes(role), isPending, isError };
}

// 소유자 여부만 알고 싶을 때
export function useIsOwner(ownerId?: string | number | null) {
  const { data, isPending, isError } = useMyInfoSuspense();
  const user = data.data;
  return { isOwner: isOwner(user, ownerId), isPending, isError };
}

// 권한 + 소유자 조건 묶어서
export function useCan(perm: PermissionKey, opts?: { ownerId?: string | number | null; requireOwnership?: boolean; allowAdminBypass?: boolean }) {
  const { data, isPending, isError } = useMyInfoSuspense();
  const user = data.data;
  return { allowed: can(user, perm, opts), isPending, isError };
}
