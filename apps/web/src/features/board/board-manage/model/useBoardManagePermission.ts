import { PERM, useCan } from "@/entities/permission";

export const useBoardManagePermission = () => useCan(PERM.BOARD_MANAGE);
