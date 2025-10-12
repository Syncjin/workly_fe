export const PERM = {
  BOARD_MANAGE: "board.manage",
  POST_EDIT: "post.edit",
  POST_DELETE: "post.delete",
} as const;
export type PermissionKey = (typeof PERM)[keyof typeof PERM];

// 필요시 역할 → 권한 매핑
export const ROLE_PERMS: Record<string, PermissionKey[]> = {
  ROLE_ADMIN: [PERM.BOARD_MANAGE, PERM.POST_EDIT, PERM.POST_DELETE],
  ROLE_USER: [PERM.POST_EDIT, PERM.POST_DELETE],
};
