/**
 * Board entity exports
 *
 * Main entry point for the board entity, providing access to
 * all board-related types, API functions, and UI components.
 */

// Model exports
export type { Board, BoardListResponse, BoardVisibility, CreateBoardRequest, UpdateBoardRequest } from "./model";

// API exports
export { boardApi } from "./api";

// UI exports
export { BoardItem } from "./ui";
