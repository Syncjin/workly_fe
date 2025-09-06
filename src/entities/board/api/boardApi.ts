/**
 * Board API functions
 * 게시판 CRUD API
 */

import type { Board } from "@/entities/board/model/types";
import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api/types";

/**
 * Board API functions
 */
export const boardApi = {
  getBoards: async (): Promise<ApiResponse<Board[]>> => {
    return await api.get<Board[]>("/boards");
  },
};
