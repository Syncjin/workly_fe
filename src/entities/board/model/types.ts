/**
 * Board entity types
 *
 * Defines the core board data structures and related types
 * for the board domain (게시판).
 */

export interface Board {
  boardId: number;
  boardName: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE";
  sortOrder: number;
  categoryId: number;
  createdDateTime: string;
  updatedDateTime: string;
}

export interface BoardListResponse {
  data: Board[];
}

// Type for board visibility options
export type BoardVisibility = "PUBLIC" | "PRIVATE";

// Type for board creation/update operations
export interface CreateBoardRequest {
  name: string;
  description: string;
  visibility: BoardVisibility;
}

export interface UpdateBoardRequest extends Partial<CreateBoardRequest> {
  id: number;
}
