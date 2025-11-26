/**
 * Comment API functions
 *
 */

import { http } from "@/shared/api/client";
import { createCommentApi } from "@workly/api";

/**
 * Comment API functions
 */

export const commentApi = createCommentApi(http);
