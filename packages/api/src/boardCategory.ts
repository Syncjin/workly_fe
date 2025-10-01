import type { ApiResponse } from "@workly/types/common";
import type { BoardCategoryDTO } from "@workly/types/domain";
import type { HttpClient } from "./http";

export function createBoardCategoryApi(http: HttpClient) {
  return {
    getBoardCategory: async (): Promise<ApiResponse<BoardCategoryDTO[]>> => {
      return http.get<BoardCategoryDTO[]>("/admin/board-categories");
    },
  };
}
