import type { User } from "@/entities/users";
import { PERM, ROLE_PERMS, type PermissionKey } from "./policies";

export function hasPermission(user?: User | null, perm?: PermissionKey) {
  if (!user || !perm) return false;
  const roles = Array.isArray(user.role) ? user.role : [user.role].filter(Boolean);
  return roles.some((r) => ROLE_PERMS[r]?.includes(perm));
}

// 도메인 특화 규칙 예시
import type { Post } from "@/entities/post";

export function isEditPost(user?: User | null, post?: Post | null) {
  if (!user || !post) return false;
  if (hasPermission(user, PERM.POST_EDIT)) return true;
  return user.id === post.user.id; // 소유자 허용
}
