/**
 * Board Category API functions
 * 게시판 카테고리 CRUD API
 */

import type { BoardCategory } from "@/entities/boardCategory/model/types";
import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api/types";

/**
 * Board Category API functions
 */
export const boardCategoryApi = {
  getBoardCategory: async (): Promise<ApiResponse<BoardCategory[]>> => {
    return await api.get<BoardCategory[]>("/admin/board-categories");
  },
};
