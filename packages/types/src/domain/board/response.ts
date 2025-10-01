
export interface BoardDTO {
  boardId: number;
  boardName: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE";
  sortOrder: number;
  categoryId: number;
  createdDateTime: string;
  updatedDateTime: string;
}