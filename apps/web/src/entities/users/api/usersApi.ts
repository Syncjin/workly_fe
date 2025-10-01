/**
 * Users API functions
 * 사용자 정보 CRUD API
 */

import { http } from "@/shared/api/client";
import { createUsersApi } from "@workly/api";

/**
 * Users API functions
 */
export const usersApi = createUsersApi(http);
