/**
 * Post API functions
 *
 */

import { http } from "@/shared/api/client";
import { createPostApi } from "@workly/api";

/**
 * Post API functions
 */

export const postApi = createPostApi(http);
