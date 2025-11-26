import { qs } from "@workly/utils";

import type { ApiResponse, BoardDetailParams, BoardDTO, BoardParams } from "@workly/types";
import type { HttpClient } from "./http";

export function createBoardApi(http: HttpClient) {
  return {
    getBoards: async (params?: BoardParams): Promise<ApiResponse<BoardDTO[]>> => {
      const query = qs({
        categoryId: params?.categoryId,
      });
      return await http.get<BoardDTO[]>(`/boards${query}`);
    },
    getBoardById: async (params: BoardDetailParams): Promise<ApiResponse<BoardDTO>> => {
      return await http.get<BoardDTO>(`/boards/${params.boardId}`);
    },
  };
}
