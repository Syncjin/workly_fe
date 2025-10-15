import { type PermissionKey } from "@/entities/permission/lib/policies";
import { useMyInfoSuspense } from "@/entities/users";
import { UserRole } from "@workly/types";
import { hasPermission } from "../lib/can";

export function usePermission(perm: PermissionKey) {
  const { data, isPending, isError } = useMyInfoSuspense();
  const user = data.data;
  const isPermitted = hasPermission(user, perm);
  return { isPermitted, isPending, isError };
}

export function useRole(role: UserRole) {
  const { data: me, isPending, isError } = useMyInfoSuspense();
  const roles = Array.isArray(me?.data?.role) ? me?.data?.role : [me?.data?.role].filter(Boolean);
  return { hasRole: !!roles?.includes(role), isPending, isError };
}
