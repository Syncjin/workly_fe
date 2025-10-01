import type { ApiResponse } from "@workly/types/common";
import type { BoardDTO, BoardParams } from "@workly/types/domain";
import type { HttpClient } from "./http";

export function createBoardApi(http: HttpClient) {
  return {
    getBoards: async (): Promise<ApiResponse<BoardDTO[]>> => {
      return http.get<BoardDTO[]>("/boards");
    },
    getBoardById: async (params: BoardParams): Promise<ApiResponse<BoardDTO>> => {
      return http.get<BoardDTO>(`/boards/${params.boardId}`);
    },
  };
}
