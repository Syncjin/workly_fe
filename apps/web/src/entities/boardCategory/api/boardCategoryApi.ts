/**
 * Board Category API functions
 * 게시판 카테고리 CRUD API
 */

import { http } from "@/shared/api/client";
import { createBoardCategoryApi } from "@workly/api";

/**
 * Board Category API functions
 */

export const boardCategoryApi = createBoardCategoryApi(http);
