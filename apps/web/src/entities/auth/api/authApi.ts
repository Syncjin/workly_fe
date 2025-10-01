/**
 * 인증 API
 */

import { http } from "@/shared/api/client";
import { createAuthApi } from "@workly/api";

/**
 * Auth API functions
 */
export const authApi = createAuthApi(http);
