/**
 * Board API functions
 * 게시판 CRUD API
 */

import { http } from "@/shared/api/client";
import { createBoardApi } from "@workly/api";

/**
 * Board API functions
 */

export const boardApi = createBoardApi(http);

/** 타입이 달라질경우 adapter 추가 */
// const raw = createBoardApi(http);
// export const boardApi = {
//   ...raw,
//   // 예: 이 메서드만 DTO→UI 변환 적용
//   getBoardById: lift(raw.getBoardById, toBoardModel),
// };
