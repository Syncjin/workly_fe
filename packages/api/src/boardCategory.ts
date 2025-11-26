import type { ApiResponse, BoardCategoryDTO } from "@workly/types";
import type { HttpClient } from "./http";

export function createBoardCategoryApi(http: HttpClient) {
  return {
    getBoardCategory: async (): Promise<ApiResponse<BoardCategoryDTO[]>> => {
      return http.get<BoardCategoryDTO[]>("/admin/board-categories");
    },
  };
}
