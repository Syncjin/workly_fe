import { PERM, usePermission } from "@/entities/permission";

export const useBoardManagePermission = () => usePermission(PERM.BOARD_MANAGE);
